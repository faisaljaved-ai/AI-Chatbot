@echo off
title FJ-Tech Solutions Launcher
echo Starting FJ-Tech Solutions White-Label AI Platform...
set "PATH=%LOCALAPPDATA%\Programs\nodejs\node-v20.18.0-win-x64;%PATH%"
curl -s http://localhost:3000/api/state >nul 2>&1
if %errorlevel% neq 0 (
    start "FJ-Tech Backend Server" cmd /k "cd /d "%~dp0backend" && node server.js"
    timeout /t 2 >nul
)
start http://localhost:3000
