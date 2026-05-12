@echo off
echo [ThreatIQ] Building Windows Agent EXE...
pip install -r requirements.txt
pyinstaller --onefile --name ThreatIQ-Agent --icon=NONE agent.py
echo [ThreatIQ] Build complete. Check the 'dist' folder.
pause
