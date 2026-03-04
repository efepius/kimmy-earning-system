@echo off
echo ========================================
echo DEPLOYING KIMMY EARNING SYSTEM TO RENDER
echo ========================================
echo.
echo Your GitHub repository is ready at:
echo https://github.com/efepius/kimmy-earning-system
echo.
echo Now deploying to Render.com for FREE hosting...
echo.
echo STEP 1: Opening Render Dashboard
echo ---------------------------------
start https://dashboard.render.com/select-repo?type=web
echo.
echo Please follow these steps:
echo.
echo 1. Sign up or login to Render.com (use GitHub to login)
echo 2. Click "Connect account" to connect your GitHub
echo 3. Select the "kimmy-earning-system" repository
echo 4. It should auto-detect the render.yaml configuration
echo 5. Click "Create Web Service"
echo.
echo Your service will be deployed automatically!
echo.
echo The URL will be something like:
echo https://kimmy-earning-system-xxxx.onrender.com
echo.
echo IMPORTANT: After deployment, add your API keys:
echo 1. Go to your service dashboard
echo 2. Click "Environment" in the left sidebar
echo 3. Add these environment variables:
echo    HIGGSFIELD_API_KEY = your-api-key-here
echo    (Get it from Higgsfield.ai dashboard)
echo.
echo The system will automatically restart after adding keys.
echo.
pause
echo.
echo Opening Render dashboard now...
start https://dashboard.render.com
echo.
echo ========================================
echo DEPLOYMENT INITIATED!
echo ========================================
echo.
echo Your autonomous earning system will be live soon!
echo Check the Render dashboard for your public URL.
echo.
pause