@echo off
cd /d "%~dp0"
echo ============================================================
echo   Pushing UrbanFlow AI Frontend Dashboard to GitHub
echo   Repository: https://github.com/rahultech-dom/smart_city.git
echo   Branch: feature/frontend-dashboard
echo ============================================================
git push -u origin feature/frontend-dashboard
pause
