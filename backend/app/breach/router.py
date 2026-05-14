from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.auth.utils import get_current_user
from datetime import datetime
import uuid
import hashlib
import requests

router = APIRouter()

# Demo breach database
DEMO_BREACHES = [
    {"email": "admin@threatiq.io", "source": "LinkedIn 2016 Leak", "date": "2016-05-12", "severity": "High"},
    {"email": "test@example.com", "source": "Adobe Leak", "date": "2013-10-04", "severity": "Medium"},
    {"email": "user@gmail.com", "source": "Canva Data Breach", "date": "2019-05-24", "severity": "High"},
    {"email": "dev@company.com", "source": "Dropbox Leak", "date": "2012-08-31", "severity": "Medium"},
]

@router.post("/check-email")
async def check_email_breach(data: dict, current_user: dict = Depends(get_current_user)):
    email = data.get("email", "").lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    # Check DB cache first (if checked in the last 24 hours)
    from datetime import timedelta
    cache_cutoff = datetime.utcnow() - timedelta(hours=24)
    cached_result = await db.breach_checks.find_one({
        "target": email,
        "type": "email",
        "status": "live",
        "created_at": {"$gt": cache_cutoff}
    })
    
    if cached_result:
        return cached_result

    found_breaches = []
    status = "live"
    
    # Use XposedOrNot Free API
    try:
        url = f"https://api.xposedornot.com/v1/check-email/{email}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            # XposedOrNot returns breaches as [[name1, name2, ...]]
            raw_breaches = data.get("breaches", [[]])
            breaches_list = raw_breaches[0] if isinstance(raw_breaches, list) and len(raw_breaches) > 0 else []
            found_breaches = [{"source": b, "date": "Unknown", "severity": "High"} for b in breaches_list]
        elif response.status_code == 404:
            found_breaches = [] 
        elif response.status_code == 429:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
        else:
            status = "error"


    except Exception as e:
        print(f"Breach API Error: {e}")
        status = "error"

    check_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": current_user["_id"],
        "target": email,
        "type": "email",
        "status": status,
        "breach_count": len(found_breaches),
        "breaches": found_breaches,
        "created_at": datetime.utcnow()
    }
    
    await db.breach_checks.insert_one(check_doc)
    return check_doc


@router.post("/check-password")
async def check_password_breach(data: dict, current_user: dict = Depends(get_current_user)):
    password = data.get("password", "")
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
    
    # Real HIBP Pwned Passwords API (k-Anonymity)
    sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]
    
    is_breached = False
    count = 0
    try:
        response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=10)
        if response.status_code == 200:
            hashes = (line.split(':') for line in response.text.splitlines())
            for h, c in hashes:
                if h == suffix:
                    is_breached = True
                    count = int(c)
                    break
    except Exception as e:
        print(f"HIBP API Error: {e}")

    check_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": current_user["_id"],
        "target": "********", 
        "type": "password",
        "is_breached": is_breached,
        "breach_count": count,
        "severity": "Critical" if is_breached else "Low",
        "recommendation": f"Change this password! Found in {count:,} breaches." if is_breached else "Password looks secure.",
        "created_at": datetime.utcnow()
    }
    
    await db.breach_checks.insert_one(check_doc)
    return check_doc

@router.get("/history")
async def get_breach_history(current_user: dict = Depends(get_current_user)):
    history = []
    async for item in db.breach_checks.find({"user_id": current_user["_id"]}).sort("created_at", -1):
        item["id"] = item["_id"]
        history.append(item)
    return history
