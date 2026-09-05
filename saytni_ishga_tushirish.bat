@echo off
chcp 65001 >nul
title Muvozanat 24 - Lokal Serverni ishga tushirish

echo =======================================================
echo         Muvozanat 24 - Lokal Server
echo =======================================================
echo(

netstat -ano | findstr :8080 >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Server allaqachon ishlab turibdi [port 8080].
) else (
    echo [INFO] Server ishga tushirilmoqda [http://localhost:8080]...
    start /b python -m http.server 8080
    timeout /t 2 /nobreak >nul
)

echo(
echo [MUVAFFAQIYATLI] Sayt brauzerda ochilmoqda...
start http://localhost:8080

echo(
echo =======================================================
echo Sayt manzili: http://localhost:8080
echo Ushbu oynani yopishingiz mumkin.
echo =======================================================
pause
