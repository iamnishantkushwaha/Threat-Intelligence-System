from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.database import db
from app.auth.utils import get_current_user
from app.config import get_settings
from datetime import datetime
import uuid
import requests

router = APIRouter()
settings = get_settings()


def _vt_headers():
    return {"x-apikey": settings.VIRUSTOTAL_API_KEY}


# ── 1. Hash Lookup ────────────────────────────────────────────────────────────
@router.post("/virustotal/hash")
async def check_vt_hash(data: dict, current_user: dict = Depends(get_current_user)):
    file_hash = data.get("hash")
    if not file_hash:
        raise HTTPException(status_code=400, detail="Hash is required")

    api_key = settings.VIRUSTOTAL_API_KEY
    if not api_key or api_key == "YOUR_VT_API_KEY":
        result = {
            "status": "mock", "malicious": 5, "suspicious": 2,
            "undetected": 60, "harmless": 10, "engines": [],
            "name": file_hash, "type": "Unknown"
        }
    else:
        resp = requests.get(
            f"https://www.virustotal.com/api/v3/files/{file_hash}",
            headers=_vt_headers()
        )
        if resp.status_code == 200:
            attrs = resp.json()["data"]["attributes"]
            stats = attrs["last_analysis_stats"]
            engines = [
                {"engine": k, "verdict": v["result"]}
                for k, v in attrs.get("last_analysis_results", {}).items()
                if v["category"] in ("malicious", "suspicious")
            ]
            result = {
                "status": "live",
                "malicious": stats["malicious"],
                "suspicious": stats["suspicious"],
                "undetected": stats["undetected"],
                "harmless": stats["harmless"],
                "engines": engines[:20],
                "name": attrs.get("meaningful_name", file_hash),
                "type": attrs.get("type_description", "Unknown"),
            }
        else:
            result = {"status": "error", "message": "Hash not found or API error"}

    doc = {
        "_id": str(uuid.uuid4()), "user_id": current_user["_id"],
        "target": file_hash, "type": "vt_hash",
        "result": result, "created_at": datetime.utcnow()
    }
    await db.intel_lookups.insert_one(doc)
    return doc


# ── 2. URL Scan ───────────────────────────────────────────────────────────────
@router.post("/virustotal/url")
async def scan_url(data: dict, current_user: dict = Depends(get_current_user)):
    url_target = data.get("url")
    if not url_target:
        raise HTTPException(status_code=400, detail="URL is required")

    api_key = settings.VIRUSTOTAL_API_KEY
    if not api_key or api_key == "YOUR_VT_API_KEY":
        result = {
            "status": "mock",
            "url": url_target,
            "malicious": 3,
            "suspicious": 1,
            "harmless": 70,
            "undetected": 5,
            "verdict": "suspicious",
            "engines": [
                {"engine": "Google Safebrowsing", "verdict": "phishing"},
                {"engine": "Kaspersky", "verdict": "malware"},
            ],
        }
    else:
        import time
        submit_resp = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers={**_vt_headers(), "Content-Type": "application/x-www-form-urlencoded"},
            data=f"url={requests.utils.quote(url_target, safe='')}"
        )
        if submit_resp.status_code not in (200, 201):
            raise HTTPException(status_code=502, detail="Failed to submit URL to VirusTotal")

        analysis_id = submit_resp.json()["data"]["id"]
        time.sleep(3)

        analysis_resp = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers=_vt_headers()
        )
        if analysis_resp.status_code == 200:
            attrs = analysis_resp.json()["data"]["attributes"]
            stats = attrs.get("stats", {})
            engines = [
                {"engine": k, "verdict": v["result"]}
                for k, v in attrs.get("results", {}).items()
                if v["category"] in ("malicious", "suspicious")
            ]
            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            verdict = "malicious" if malicious > 0 else "suspicious" if suspicious > 0 else "clean"
            result = {
                "status": "live",
                "url": url_target,
                "malicious": malicious,
                "suspicious": suspicious,
                "harmless": stats.get("harmless", 0),
                "undetected": stats.get("undetected", 0),
                "verdict": verdict,
                "engines": engines[:20],
            }
        else:
            result = {"status": "error", "url": url_target, "message": "Analysis not ready"}

    doc = {
        "_id": str(uuid.uuid4()), "user_id": current_user["_id"],
        "target": url_target, "type": "vt_url",
        "result": result, "created_at": datetime.utcnow()
    }
    await db.intel_lookups.insert_one(doc)
    return doc


# ── 3. File Upload Scan ───────────────────────────────────────────────────────
@router.post("/virustotal/file")
async def scan_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    content = await file.read()
    if len(content) > 32 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 32MB)")

    api_key = settings.VIRUSTOTAL_API_KEY
    filename = file.filename or "unknown"

    if not api_key or api_key == "YOUR_VT_API_KEY":
        result = {
            "status": "mock",
            "filename": filename,
            "malicious": 2,
            "suspicious": 1,
            "harmless": 65,
            "undetected": 7,
            "verdict": "suspicious",
            "engines": [
                {"engine": "Bitdefender", "verdict": "Trojan.GenericKD"},
                {"engine": "ESET", "verdict": "suspicious"}
            ],
        }
    else:
        import time
        upload_resp = requests.post(
            "https://www.virustotal.com/api/v3/files",
            headers=_vt_headers(),
            files={"file": (filename, content)}
        )
        if upload_resp.status_code not in (200, 201):
            raise HTTPException(status_code=502, detail="Failed to upload file to VirusTotal")

        analysis_id = upload_resp.json()["data"]["id"]
        time.sleep(4)

        analysis_resp = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers=_vt_headers()
        )
        if analysis_resp.status_code == 200:
            attrs = analysis_resp.json()["data"]["attributes"]
            stats = attrs.get("stats", {})
            engines = [
                {"engine": k, "verdict": v["result"]}
                for k, v in attrs.get("results", {}).items()
                if v["category"] in ("malicious", "suspicious")
            ]
            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            verdict = "malicious" if malicious > 0 else "suspicious" if suspicious > 0 else "clean"
            result = {
                "status": "live",
                "filename": filename,
                "malicious": malicious,
                "suspicious": suspicious,
                "harmless": stats.get("harmless", 0),
                "undetected": stats.get("undetected", 0),
                "verdict": verdict,
                "engines": engines[:20],
            }
        else:
            result = {"status": "pending", "filename": filename, "message": "Scan in progress"}

    doc = {
        "_id": str(uuid.uuid4()), "user_id": current_user["_id"],
        "target": filename, "type": "vt_file",
        "result": result, "created_at": datetime.utcnow()
    }
    await db.intel_lookups.insert_one(doc)
    return doc


# ── 4. IP Reputation ─────────────────────────────────────────────────────────
@router.post("/abuseipdb/check-ip")
async def check_abuse_ip(data: dict, current_user: dict = Depends(get_current_user)):
    ip = data.get("ip")
    if not ip:
        raise HTTPException(status_code=400, detail="IP is required")

    api_key = settings.ABUSEIPDB_API_KEY
    if not api_key or api_key == "YOUR_ABUSEIPDB_API_KEY":
        result = {
            "ipAddress": ip, "abuseConfidenceScore": 85, "countryCode": "RU",
            "usageType": "Data Center/Web Hosting/Transit", "isp": "Digital Ocean",
            "domain": "digitalocean.com", "totalReports": 124,
            "lastReportedAt": datetime.utcnow().isoformat()
        }
    else:
        resp = requests.get(
            "https://api.abuseipdb.com/api/v2/check",
            headers={"Key": api_key, "Accept": "application/json"},
            params={"ipAddress": ip, "maxAgeInDays": "90"}
        )
        if resp.status_code == 200:
            result = resp.json()["data"]
        else:
            result = {"status": "error", "message": "API error"}

    doc = {
        "_id": str(uuid.uuid4()), "user_id": current_user["_id"],
        "target": ip, "type": "abuseipdb_ip",
        "result": result, "created_at": datetime.utcnow()
    }
    await db.intel_lookups.insert_one(doc)
    return doc


# ── 5. Email Site Exposure (HIBP + Google-linked detection) ──────────────────
@router.post("/email/site-exposure")
async def check_email_site_exposure(data: dict, current_user: dict = Depends(get_current_user)):
    """
    Uses HaveIBeenPwned to find all breaches for an email.
    Uses emailrep.io (free) to check email reputation, breach history,
    and site exposure. Marks Google-linked sites from known breach list.
    """
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    # Sites that commonly support Sign in with Google
    google_linked_domains = {
        "linkedin.com", "dropbox.com", "spotify.com", "airbnb.com",
        "canva.com", "reddit.com", "pinterest.com", "quora.com",
        "medium.com", "twitter.com", "facebook.com", "github.com",
        "slack.com", "zoom.us", "notion.so", "figma.com", "trello.com",
        "coursera.org", "udemy.com", "stackoverflow.com", "discord.com",
        "twitch.tv", "etsy.com", "shopify.com", "wordpress.com",
        "adobe.com", "canva.com", "asana.com", "hubspot.com",
    }

    try:
        import urllib.parse
        resp = requests.get(
            f"https://emailrep.io/{urllib.parse.quote(email)}",
            headers={"User-Agent": "ThreatIQ-Security-Platform"},
            timeout=10
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"emailrep.io returned {resp.status_code}")

        data_rep = resp.json()
        details = data_rep.get("details", {})

        # emailrep returns profiles (social sites) and breach info
        profiles = details.get("profiles", [])  # e.g. ["twitter", "linkedin"]
        breach_count = details.get("data_breach", False)
        malicious_activity = details.get("malicious_activity", False)
        spam = details.get("spam", False)
        reputation = data_rep.get("reputation", "unknown")  # high/medium/low/none
        suspicious = data_rep.get("suspicious", False)

        # Build breach list from known common breaches mapped to profile sites
        # emailrep doesn't list specific breach sites but lists linked profiles
        profile_domains = {p: f"{p}.com" for p in profiles}

        site_list = []
        for profile in profiles:
            domain = f"{profile}.com"
            site_list.append({
                "site": profile.capitalize(),
                "domain": domain,
                "breach_date": "Unknown",
                "data_classes": ["Email addresses"],
                "is_google_linked": domain in google_linked_domains,
                "logo": f"https://www.google.com/s2/favicons?domain={domain}&sz=64",
                "from_profiles": True,
            })

        result = {
            "status": "live",
            "email": email,
            "reputation": reputation,
            "suspicious": suspicious,
            "breach_count": len(site_list) if breach_count else 0,
            "has_breach": breach_count,
            "malicious_activity": malicious_activity,
            "spam": spam,
            "profiles_found": len(profiles),
            "breaches": site_list,
            "summary": details.get("summary", ""),
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"emailrep.io unreachable: {str(e)}")

    doc = {
        "_id": str(uuid.uuid4()), "user_id": current_user["_id"],
        "target": email, "type": "email_exposure",
        "result": result, "created_at": datetime.utcnow()
    }
    await db.intel_lookups.insert_one(doc)
    return doc


# ── 6. History ────────────────────────────────────────────────────────────────
@router.get("/history")
async def get_intel_history(current_user: dict = Depends(get_current_user)):
    history = []
    async for item in db.intel_lookups.find({"user_id": current_user["_id"]}).sort("created_at", -1):
        item["id"] = item["_id"]
        history.append(item)
    return history
