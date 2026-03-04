@echo off
echo ====================================
echo  KIMMY AUTONOMOUS EARNING SYSTEM   
echo ====================================
echo.

echo Starting all components...
echo.

:: Start the main system
echo [1/3] Starting Main Earning System...
start "Kimmy Main System" cmd /k "cd src && python main.py"
timeout /t 3 /nobreak >nul

:: Start the dashboard
echo [2/3] Starting Dashboard Server...
start "Kimmy Dashboard" cmd /k "cd src && python dashboard.py"
timeout /t 3 /nobreak >nul

:: Start the Higgsfield agent
echo [3/3] Starting Higgsfield Content Agent...
start "Higgsfield Agent" cmd /k "cd src && python higgsfield_agent.py"
timeout /t 2 /nobreak >nul

echo.
echo ====================================
echo  ALL SYSTEMS RUNNING!              
echo ====================================
echo.
echo Dashboard: http://localhost:8080
echo.
echo Press any key to open dashboard in browser...
pause >nul
start http://localhost:8080

echo.
echo System is running in background windows.
echo Close this window to keep systems running.
pause