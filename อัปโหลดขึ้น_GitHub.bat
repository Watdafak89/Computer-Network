@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   NetQuest 16-Bit - Upload to GitHub
echo   Repo: https://github.com/Watdafak89/Computer-Network-Course
echo ============================================================
echo.
git status -sb
echo.
echo [1/2] Signing in and pushing branch main to origin...
echo If a GitHub Sign-in popup appears, click "Sign in with your browser".
echo.
git push -u origin main
echo.
if %errorlevel% equ 0 (
  echo ============================================================
  echo   SUCCESS! Uploaded to GitHub!
  echo   https://github.com/Watdafak89/Computer-Network-Course
  echo ============================================================
) else (
  echo ============================================================
  echo   Push failed or canceled. Please check the message above.
  echo ============================================================
)
echo.
pause
