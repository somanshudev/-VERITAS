@echo off
echo ========================================
echo IC Marking Verification - MongoDB Setup
echo ========================================
echo.

echo Step 1: Installing MongoDB dependency...
call npm install mongodb
echo.

echo Step 2: Creating .env.local file...
if not exist .env.local (
    echo MONGODB_URI=mongodb://localhost:27017/ic_marking> .env.local
    echo DB_NAME=ic_marking>> .env.local
    echo .env.local file created!
    echo.
    echo IMPORTANT: Edit .env.local if using MongoDB Atlas
    echo.
) else (
    echo .env.local already exists, skipping...
    echo.
)

echo Step 3: Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Make sure MongoDB is running
echo    - Windows: net start MongoDB
echo    - Or use MongoDB Atlas (cloud)
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
echo ========================================
echo For detailed instructions, see:
echo MONGODB_SETUP_GUIDE.md
echo ========================================
echo.
pause
