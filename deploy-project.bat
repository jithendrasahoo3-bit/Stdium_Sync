@echo off
title StadiumSync - Deploy to GitHub Pages
echo ========================================================
echo StadiumSync 2026 - GitHub Deployment script
echo ========================================================
echo.

:: Check for Git installation
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system's PATH.
    echo Please download and install Git from: https://git-scm.com/
    echo after installation, restart this script.
    echo.
    pause
    exit /b
)

echo [SUCCESS] Git detected! Proceeding with deployment...
echo.

:: Initialize Git repository
if not exist .git (
    echo Initializing local Git repository...
    git init
) else (
    echo Local Git repository already initialized.
)

:: Add remote origin if it doesn't exist
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo Adding GitHub remote origin...
    git remote add origin https://github.com/kesavanaidu038/stadiumsync.git
) else (
    echo Updating remote origin URL...
    git remote set-url origin https://github.com/kesavanaidu038/stadiumsync.git
)

:: Stage all files
echo Staging project files...
git add .

:: Commit files
echo Committing files...
git commit -m "Configure GitHub Pages deployment pipeline and stadium booking portal"

:: Rename default branch to main
git branch -M main

:: Push to main branch
echo.
echo ========================================================
echo Pushing code to https://github.com/kesavanaidu038/stadiumsync
echo (If prompted, please authenticate with your GitHub account)
echo ========================================================
echo.
git push -u origin main

echo.
echo ========================================================
echo Deployment process complete!
echo.
echo Once pushed, go to your GitHub repository:
echo https://github.com/kesavanaidu038/stadiumsync
echo.
echo Under "Settings" -> "Pages":
echo 1. Change Source to "GitHub Actions" (Recommended).
echo 2. The pipeline will automatically build and publish your site!
echo.
echo Your live site link will be:
echo https://kesavanaidu038.github.io/stadiumsync/
echo ========================================================
echo.
pause
