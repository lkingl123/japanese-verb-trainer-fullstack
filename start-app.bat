@echo off
echo ========================================
echo Japanese Verb Trainer - Local Development
echo ========================================
echo.
echo Starting frontend development server...
echo.
echo Frontend: http://localhost:5173
echo.
echo Opening browser in 2 seconds...
echo.

cd /d "%~dp0"

REM Open browser to frontend
timeout /t 2 /nobreak > nul
start http://localhost:5173

REM Start development server
call npm run dev
