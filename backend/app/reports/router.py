from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from app.database import db
from app.auth.utils import get_current_user
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
import os
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/generate")
async def generate_report(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    
    # Gather data for report
    user_agents = []
    async for agent in db.agents.find({"user_id": user_id}):
        user_agents.append(agent)
    
    agent_ids = [a["_id"] for a in user_agents]
    
    threats = []
    async for threat in db.threats.find({"agent_id": {"$in": agent_ids}}).sort("created_at", -1):
        threats.append(threat)
        
    log_count = await db.system_logs.count_documents({"agent_id": {"$in": agent_ids}})
    
    # PDF generation
    report_id = str(uuid.uuid4())
    filename = f"report_{report_id}.pdf"
    filepath = os.path.join(os.getcwd(), filename)
    
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Title
    elements.append(Paragraph(f"ThreatIQ Security Report", styles['Title']))
    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    elements.append(Paragraph(f"Analyst: {current_user['name']}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Executive Summary
    elements.append(Paragraph("Executive Summary", styles['Heading2']))
    summary_text = f"This report provides an overview of the security posture for {len(user_agents)} monitored agents. " \
                   f"A total of {log_count} system logs were analyzed, resulting in {len(threats)} detected threats."
    elements.append(Paragraph(summary_text, styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Threats Table
    elements.append(Paragraph("Detected Threats", styles['Heading2']))
    if threats:
        data = [["Severity", "Title", "Device", "Status", "Date"]]
        for t in threats[:20]: # Limit to top 20 for report
            data.append([
                t["severity"], 
                t["title"][:40], 
                t["device_name"], 
                t["status"], 
                t["created_at"].strftime('%Y-%m-%d')
            ])
        
        t_table = Table(data, colWidths=[60, 200, 100, 60, 80])
        t_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(t_table)
    else:
        elements.append(Paragraph("No threats detected during this period.", styles['Normal']))
        
    doc.build(elements)
    
    # Save report record in DB
    report_record = {
        "_id": report_id,
        "user_id": user_id,
        "title": f"Security Report - {datetime.now().strftime('%b %Y')}",
        "file_path": filepath,
        "summary": summary_text,
        "created_at": datetime.utcnow()
    }
    await db.reports.insert_one(report_record)
    
    return {"id": report_id, "message": "Report generated successfully"}

@router.get("/")
async def get_reports(current_user: dict = Depends(get_current_user)):
    reports = []
    async for report in db.reports.find({"user_id": current_user["_id"]}).sort("created_at", -1):
        report["id"] = report["_id"]
        reports.append(report)
    return reports

@router.get("/download/{report_id}")
async def download_report(report_id: str, current_user: dict = Depends(get_current_user)):
    report = await db.reports.find_one({"_id": report_id, "user_id": current_user["_id"]})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return FileResponse(path=report["file_path"], filename=f"ThreatIQ_Report_{report_id}.pdf")
