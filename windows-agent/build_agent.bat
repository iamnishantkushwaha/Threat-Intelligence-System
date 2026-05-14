@echo off
echo ===================================================
echo ThreatIQ Agent Build Script
echo ===================================================
echo.

echo [1/4] Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    pause
    exit /b 1
)

echo [2/4] Installing dependencies...
pip install pyinstaller requests psutil pywin32 yara-python
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo [3/4] Building Executable...
echo This may take a few minutes...
pyinstaller --onedir --name ThreatIQAgent --icon=NONE --add-data "rules;rules" agent.py



if %errorlevel% neq 0 (
    echo Error: Build failed.
    pause
    exit /b 1
)

echo.
echo [4/4] Success!
echo Executable created in: dist\ThreatIQAgent.exe
echo.

echo [Optional] Copying config to dist folder...
copy config.json dist\ThreatIQAgent\ /Y >nul
:: Rules are already bundled via --add-data, but we copy for redundancy
xcopy /E /I /Y rules dist\ThreatIQAgent\rules >nul

echo IMPORTANT: 
echo 1. The agent is in: dist\ThreatIQAgent\ThreatIQAgent.exe
echo 2. Ensure 'config.json' is configured correctly in that folder.
echo 3. Run as Administrator for full log access.
echo.
pause


