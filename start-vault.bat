@echo off
title SecureVault - Starting...
color 0A

echo.
echo  ╔═══════════════════════════════════════════════════════╗
echo  ║           🔐 SecureVault - Password Manager           ║
echo  ╠═══════════════════════════════════════════════════════╣
echo  ║  Starting your secure vault...                        ║
echo  ╚═══════════════════════════════════════════════════════╝
echo.

:: Set the working directory to the script location
cd /d "%~dp0"

:: Set environment variables
set DATABASE_URL=file:./dev.db
set NEXTAUTH_URL=http://localhost:3000
set NEXTAUTH_SECRET=Dv8kL2mN9pR3sT6vX0zB4fH7jK1nQ5uW8yA2cE6gI0lO3rU7wZ1xC5bM9dF4hJ
set ENCRYPTION_KEY=S3cur3VaultKey2024Protect1234

:: Check if node_modules exists
if not exist "node_modules" (
    echo  [!] Dependencies not found. Installing...
    echo.
    call npm install
    echo.
    echo  [✓] Dependencies installed!
    echo.
)

:: Check if database exists
if not exist "prisma\dev.db" (
    echo  [!] Database not found. Setting up...
    echo.
    call npx prisma generate
    call npx prisma db push
    echo.
    echo  [✓] Database created!
    echo.
    
    :: Ask if user wants to seed demo data
    set /p SEED_DB="  [?] Add demo data? (y/n): "
    if /i "%SEED_DB%"=="y" (
        call npx tsx prisma/seed.ts
        echo.
        echo  [✓] Demo data added!
        echo  [i] Login: demo@securevault.com / Demo@123
    )
    echo.
)

echo.
echo  [*] Starting SecureVault server...
echo  [*] Opening browser at http://localhost:3000
echo.
echo  ════════════════════════════════════════════════════════
echo   Press Ctrl+C to stop the server
echo  ════════════════════════════════════════════════════════
echo.

:: Wait a moment then open browser
start "" "http://localhost:3000"

:: Start the development server
call npm run dev
