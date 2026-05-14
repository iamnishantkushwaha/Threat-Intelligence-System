# ThreatIQ Security Platform

ThreatIQ is a modern, full-stack threat intelligence and endpoint monitoring system. It features a high-performance FastAPI backend, a real-time React dashboard, and a lightweight Python-based Windows security agent.

## 📘 Run Instructions

For complete setup and execution steps (Docker, local development, and Windows agent), see `RUN.md`.

## 🚀 Quick Start (Docker)

To spin up the entire infrastructure (Backend, Frontend, and MongoDB):

```bash
docker-compose up --build
```

- **Frontend Console**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🛡️ Windows Agent Setup

The agent monitors system logs, processes, and files for suspicious activity.

### **Verification: Is the Agent Working?**

1.  **Dashboard Status:** The agent will appear as `ACTIVE` on the **Agents** page once it connects.
2.  **Heartbeat:** Check `agent.log` in the agent folder. You should see "Sending heartbeat..." every few seconds.
3.  **Real-Time Alerts:** Create an empty file named `malware.exe` in your Downloads folder. If your YARA rules are active, the agent will instantly report it to the **Malware** dashboard.

### **How to Generate the `.exe`**

To package the agent into a standalone Windows Executable:

1.  Open a terminal in the `windows-agent/` folder on your Windows machine.
2.  Run the build script:
    ```cmd
    build_agent.bat
    ```
3.  Find `ThreatIQAgent.exe` in the `dist/` folder.
4.  **Deployment:** Copy `ThreatIQAgent.exe`, `config.json`, and the `rules/` folder to the target machine.
5.  **Run:** Execute `ThreatIQAgent.exe` as **Administrator**.

## 🏗️ Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS 4. Uses WebSockets for real-time threat notifications.
- **Backend**: FastAPI + MongoDB (Motor). Implements JWT authentication, telemetry ingestion, and automated PDF reporting.
- **Agent**: Python 3. Uses `pywin32` for event log access, `psutil` for process monitoring, and `yara-python` for file pattern matching.

## 🛠️ Features

- **Real-Time Alerts**: Instant toast notifications and audio alerts in the dashboard.
- **Email Phishing Analyzer**: Heuristic-based analysis of suspicious emails and links.
- **Data Breach Checker**: Live password compromise checks via HIBP and simulated email breach monitoring.
- **Threat Intelligence**: Global reputation lookups via VirusTotal and AbuseIPDB.
- **Automated Reporting**: Generate comprehensive PDF security reports with one click.
- **Heuristic Detection**: Identifies suspicious PowerShell commands and Temp-space execution.
- **YARA Integration**: Customizable pattern matching for files in Downloads, Desktop, and Temp folders.
- **Agent Health Monitoring**: Automatically tracks agent status (Online/Offline) via heartbeat telemetry.

## 📄 License

Propetary - Developed for Threat Intelligence Operations.
