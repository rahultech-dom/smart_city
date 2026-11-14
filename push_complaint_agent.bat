@echo off
cd /d "%~dp0"
echo ============================================================
echo   Pushing City Complaint Agent (Member 2) to GitHub
echo   Repository: https://github.com/rahultech-dom/smart_city.git
echo ============================================================
git push -u origin feature/city-complaint-agent
git push -u origin main
pause
