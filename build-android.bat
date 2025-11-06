@echo off
echo Building Karmic Canteen Android APK...
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building Android APK...
echo Choose build method:
echo 1. EAS Build (Recommended)
echo 2. Expo Build (Legacy)
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Building with EAS...
    call npx eas-cli build --platform android --profile preview
) else if "%choice%"=="2" (
    echo Building with Expo...
    call npx expo build:android --type apk
) else (
    echo Invalid choice. Using EAS Build...
    call npx eas-cli build --platform android --profile preview
)

echo.
echo Build process completed!
echo Check your Expo dashboard for download link.
pause