@echo off
echo ===============================================
echo     KIMMY SYSTEM - AUTOMATIC DEPLOYMENT
echo ===============================================
echo.

echo Creating GitHub repository...
echo Please follow these steps:
echo.
echo 1. Go to: https://github.com/new
echo 2. Repository name: kimmy-earning-system
echo 3. Make it PUBLIC
echo 4. DO NOT initialize with README
echo 5. Click "Create repository"
echo.
echo Press any key when you've created the repository...
pause >nul

echo.
echo Setting up Git remote...
git remote remove origin 2>nul
git remote add origin https://github.com/EfeKing24/kimmy-earning-system.git
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ===============================================
echo     GITHUB SETUP COMPLETE!
echo ===============================================
echo.
echo Now deploying to FREE hosting...
echo.
echo Opening Render.com for deployment...
start https://dashboard.render.com/select-repo?type=web

echo.
echo ===============================================
echo     DEPLOYMENT INSTRUCTIONS:
echo ===============================================
echo.
echo 1. Sign in to Render with GitHub
echo 2. Click "Connect" next to kimmy-earning-system
echo 3. Service Name: kimmy-earning-system
echo 4. Branch: main
echo 5. Build Command: pip install -r requirements.txt
echo 6. Start Command: python src/dashboard.py
echo 7. Click "Create Web Service"
echo.
echo Your FREE URL will be:
echo https://kimmy-earning-system.onrender.com
echo.
echo The deployment will take 2-5 minutes.
echo.
pause