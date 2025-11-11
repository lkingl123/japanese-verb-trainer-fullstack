@echo off
echo ========================================
echo Japanese Verb Trainer - Initial Setup
echo ========================================
echo.
echo This will install all dependencies.
echo This only needs to be run ONCE.
echo.
pause

echo.
echo Installing Dependencies...
cd /d "%~dp0"
call npm install
if errorlevel 1 (
    echo ERROR: Installation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo            SETUP SUCCESSFUL!
echo ========================================
echo.
echo Next Steps:
echo 1. Double-click START_APP.bat to run the application
echo.
echo Your browser will automatically open to http://localhost:5173
echo.
echo Happy Learning! がんばって！
echo.
pause
