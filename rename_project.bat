@echo off
echo Renaming DSA-Buddy to AlgoViz-Lab...
echo.
echo Please close your IDE/editor before running this script.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

cd "d:\MCA SEM 1"
if exist "AlgoViz-Lab" (
    echo AlgoViz-Lab folder already exists!
    echo Please remove it first or choose a different name.
    pause
    exit /b 1
)

echo Renaming DSA-Buddy folder to AlgoViz-Lab...
ren "DSA-Buddy" "AlgoViz-Lab"

if %errorlevel% neq 0 (
    echo Failed to rename main folder!
    pause
    exit /b 1
)

echo Successfully renamed project folder!
echo.
echo You can now open the project from: d:\MCA SEM 1\AlgoViz-Lab
echo.
echo The project is ready to run with:
echo   python manage.py runserver
echo   or
echo   python run_server.py
echo.
pause