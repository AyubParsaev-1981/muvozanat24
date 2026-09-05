@echo off
chcp 65001 >nul
title Muvozanat 24 - Telegram Bot (@muvozanat24_bot)
color 0B
cls

echo ======================================================================
echo          MUVOZANAT 24 - RASMIY TELEGRAM BOT BOSHQARUVI
echo ======================================================================
echo Bot username: @muvozanat24_bot
echo Bot havolasi: https://t.me/muvozanat24_bot
echo Rasmiy sayt:  https://ayubparsaev-1981.github.io/muvozanat24/
echo ======================================================================
echo(

:: Python mavjudligini tekshirish
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [XATO] Kompyuteringizda Python topilmadi!
    echo Iltimos, Python ni https://www.python.org/downloads/ manzilidan o'rnating.
    echo(
    pause
    exit /b 1
)

:: Kerakli kutubxonalarni tekshirish
echo [*] Kutubxonalar tekshirilmoqda...
python -c "import telebot, requests" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [*] Kerakli kutubxonalar o'rnatilmoqda (pyTelegramBotAPI, requests)...
    pip install pyTelegramBotAPI requests
)

echo [OK] Barcha sozlamalar tayyor.
echo(
echo ======================================================================
echo   BOT ISHGA TUSHIRILMOQDA... (To'xtatish uchun: Ctrl+C)
echo ======================================================================
echo(

:loop
python bot.py
echo(
echo [OGOHLANTIRISH] Bot to'xtadi yoki uzilish bo'ldi.
echo 3 soniyadan so'ng qayta ishga tushadi...
timeout /t 3 /nobreak >nul
goto loop
