@echo off
title ThreatIQ Agent Runner
echo Starting ThreatIQ Agent...

:loop
echo [%date% %time%] Checking dependencies...
python -m pip install -r requirements.txt >nul 2>&1

echo [%date% %time%] Launching Agent...
python agent.py

echo [%date% %time%] Agent stopped or crashed. Restarting in 10 seconds...
timeout /t 10
goto loop
