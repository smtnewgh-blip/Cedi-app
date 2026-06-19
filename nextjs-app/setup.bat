@echo off
REM Cedi App - Complete Setup Script for Windows
REM This script automates the setup process for your Next.js + Supabase + OpenAI app

setlocal enabledelayedexpansion

echo.
echo 🚀 Cedi App Setup Script
echo =======================
echo.

REM Check if .env.local exists
if exist .env.local (
    echo ✅ .env.local already exists
    set /p response="Do you want to reconfigure? (y/n): "
    if /i not "!response!"=="y" (
        echo Skipping configuration...
        exit /b 0
    )
)

echo.
echo 📋 Setup Instructions:
echo ====================
echo.
echo Before continuing, you need to have:
echo 1. ✅ Supabase account and project (https://supabase.com)
echo 2. ✅ OpenAI API key (https://platform.openai.com)
echo 3. ✅ Node.js 18+ installed
echo.

pause

echo.
echo 🔐 Please enter your credentials:
echo ==================================
echo.

set /p SUPABASE_URL="Enter your Supabase Project URL: "
if "!SUPABASE_URL!"=="" (
    echo ❌ Supabase URL is required
    exit /b 1
)

set /p SUPABASE_KEY="Enter your Supabase Publishable Key: "
if "!SUPABASE_KEY!"=="" (
    echo ❌ Supabase Key is required
    exit /b 1
)

set /p OPENAI_KEY="Enter your OpenAI API Key: "
if "!OPENAI_KEY!"=="" (
    echo ❌ OpenAI API Key is required
    exit /b 1
)

(
    echo # Supabase Configuration
    echo NEXT_PUBLIC_SUPABASE_URL=!SUPABASE_URL!
    echo NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=!SUPABASE_KEY!
    echo.
    echo # OpenAI Configuration
    echo OPENAI_API_KEY=!OPENAI_KEY!
    echo.
    echo # App Configuration
    echo NEXT_PUBLIC_APP_URL=http://localhost:3000
) > .env.local

echo.
echo ✅ .env.local created successfully!
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Setup Complete!
echo.
echo 🚀 You can now run the app with:
echo    npm run dev
echo.
echo Then visit: http://localhost:3000
echo.

pause
