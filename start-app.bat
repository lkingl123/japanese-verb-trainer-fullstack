@echo off
echo ========================================
echo Japanese Verb Trainer - Local Development
echo ========================================
echo.
echo Starting both API server and frontend...
echo.
echo API Server: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Opening browser in 2 seconds...
echo.

cd /d "%~dp0"

REM Open browser to frontend (not API server)
timeout /t 2 /nobreak > nul
start http://localhost:5173

REM Start servers
call npm run dev:full
