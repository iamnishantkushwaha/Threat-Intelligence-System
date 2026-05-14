from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.auth.utils import get_current_user
from datetime import datetime
import uuid
import re

router = APIRouter()

PHISHING_KEYWORDS = [
    "urgent", "action required", "account suspended", "verify your account",
    "unauthorized access", "winner", "lottery", "gift card", "bank transfer",
    "password reset", "official notification", "claim your prize"
]

SUSPICIOUS_TLDS = [".xyz", ".top", ".club", ".link", ".click", ".zip", ".mov"]

def analyze_email_content(text: str, sender: str):
    urls = re.findall(r'(https?://\S+)', text)
    suspicious_urls = []
    reasons = []
    risk_score = 0
    
    # Check for phishing keywords
    keyword_matches = [k for k in PHISHING_KEYWORDS if k in text.lower()]
    if keyword_matches:
        reasons.append(f"Contains phishing keywords: {', '.join(keyword_matches[:3])}")
        risk_score += len(keyword_matches) * 15
        
    # Check for suspicious URLs
    for url in urls:
        if any(tld in url.lower() for tld in SUSPICIOUS_TLDS):
            suspicious_urls.append(url)
            risk_score += 30
            reasons.append(f"Suspicious TLD found in URL: {url}")
        
        # Check for URL shorteners
        if any(s in url.lower() for s in ["bit.ly", "t.co", "tinyurl.com", "is.gd"]):
            suspicious_urls.append(url)
            risk_score += 20
            reasons.append(f"URL shortener detected: {url}")

    # Check for domain mismatch in sender (simulated)
    if sender and "@" in sender:
        domain = sender.split("@")[-1]
        if any(tld in domain.lower() for tld in SUSPICIOUS_TLDS):
            reasons.append(f"Sender domain uses suspicious TLD: {domain}")
            risk_score += 25

    # Determine severity
    severity = "Low"
    if risk_score >= 70: severity = "Critical"
    elif risk_score >= 40: severity = "High"
    elif risk_score >= 20: severity = "Medium"
    
    recommendation = "This email looks safe."
    if severity == "Critical":
        recommendation = "DO NOT click any links. Delete this email immediately and report it to IT."
    elif severity == "High":
        recommendation = "Treat with extreme caution. Verify the sender through a secondary channel."
    elif severity == "Medium":
        recommendation = "Be cautious with any links or attachments."

    return {
        "urls": urls,
        "suspicious_urls": suspicious_urls,
        "risk_score": min(risk_score, 100),
        "severity": severity,
        "reasons": reasons,
        "recommendation": recommendation
    }

@router.post("/analyze")
async def analyze_email(data: dict, current_user: dict = Depends(get_current_user)):
    text = data.get("text", "")
    sender = data.get("sender", "")
    subject = data.get("subject", "No Subject")
    
    if not text:
        raise HTTPException(status_code=400, detail="Email text is required")
        
    result = analyze_email_content(text, sender)
    
    analysis_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": current_user["_id"],
        "sender": sender,
        "subject": subject,
        "text_preview": text[:200],
        **result,
        "created_at": datetime.utcnow()
    }
    
    await db.email_analysis.insert_one(analysis_doc)
    return analysis_doc

@router.get("/history")
async def get_email_history(current_user: dict = Depends(get_current_user)):
    history = []
    async for item in db.email_analysis.find({"user_id": current_user["_id"]}).sort("created_at", -1):
        item["id"] = item["_id"]
        history.append(item)
    return history
