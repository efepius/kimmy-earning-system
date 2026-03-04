@echo off
echo ========================================
echo KIMMY AUTONOMOUS EARNING SYSTEM DEPLOYER
echo ========================================
echo.
echo This script will:
echo 1. Create GitHub repository
echo 2. Push your code
echo 3. Deploy to Render.com
echo 4. Get your public URL
echo.
pause

echo.
echo STEP 1: Creating GitHub Repository
echo -----------------------------------
echo Opening GitHub in browser...
start https://github.com/new

echo.
echo Please create a new repository called: kimmy-earning-system
echo Make it PUBLIC (important for free hosting!)
echo Do NOT initialize with README (we already have one)
echo.
echo Press any key when you've created the repository...
pause > nul

echo.
echo STEP 2: Adding GitHub Remote
echo ----------------------------
set /p GITHUB_USERNAME=Enter your GitHub username (probably EfeKing24): 

git remote add origin https://github.com/%GITHUB_USERNAME%/kimmy-earning-system.git 2>nul
git remote set-url origin https://github.com/%GITHUB_USERNAME%/kimmy-earning-system.git

echo.
echo STEP 3: Pushing Code to GitHub
echo ------------------------------
echo Pushing code to GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo If push failed, you may need to login to GitHub.
    echo Try running: git push -u origin main
    echo.
    pause
) else (
    echo Code successfully pushed to GitHub!
)

echo.
echo STEP 4: Deploying to Render.com
echo --------------------------------
echo Opening Render.com...
start https://dashboard.render.com/register

echo.
echo Please:
echo 1. Sign up/Login to Render.com (use GitHub login for easy connection)
echo 2. Click "New +" button
echo 3. Select "Web Service"
echo 4. Connect your GitHub account if not already connected
echo 5. Select the "kimmy-earning-system" repository
echo 6. Use these settings:
echo    - Name: kimmy-earning-system
echo    - Environment: Python 3
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: python src/main.py
echo    - Instance Type: Free
echo 7. Click "Create Web Service"
echo.
echo Your app will deploy and you'll get a URL like:
echo https://kimmy-earning-system.onrender.com
echo.
echo Press any key when deployment is complete...
pause > nul

echo.
echo STEP 5: Final Setup
echo -------------------
echo Your system should now be live!
echo.
echo Dashboard URL will be: https://your-app-name.onrender.com
echo.
echo To add your Higgsfield API key:
echo 1. Go to Render.com dashboard
echo 2. Click on your service
echo 3. Go to "Environment" tab
echo 4. Add variable: HIGGSFIELD_API_KEY = your-key-here
echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your autonomous earning system is now:
echo - Hosted on GitHub
echo - Deployed to Render.com
echo - Running 24/7
echo - Accessible via public URL
echo.
echo Check https://dashboard.render.com for your live URL!
echo.
pause