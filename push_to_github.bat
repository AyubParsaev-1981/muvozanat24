@echo off
chcp 65001 >nul
title Muvozanat 24 - GitHub ga yuklash
cls

echo =======================================================
echo         Muvozanat 24 - GitHub ga yuklash
echo   Repozitoriya: https://github.com/AyubParsaev-1981/muvozanat24
echo =======================================================
echo(

set PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%LOCALAPPDATA%\Programs\MinGit\mingw64\bin;%PATH%

echo [*] Fayllar tekshirilmoqda...
git add -A
git commit -m "Update Muvozanat 24 platform and all project files" >nul 2>&1
echo [OK] Barcha mahalliy o'zgarishlar tayyorlandi.
echo(

echo =======================================================
echo Qaysi usulda GitHub ga yuklamoqchisiz?
echo =======================================================
echo 1 - Avtomatik kirish orqali yuklash [Tavsiya etiladi]
echo 2 - GitHub Personal Access Token [PAT] orqali yuklash
echo 3 - Brauzerda qo'lda yuklash [Drag and Drop]
echo =======================================================
echo(

set /p USUL="Tanlovingizni kiriting [1, 2 yoki 3]: "

if "%USUL%"=="1" goto usul1
if "%USUL%"=="2" goto usul2
if "%USUL%"=="3" goto usul3
goto usul1

:usul1
echo(
echo -------------------------------------------------------
echo 1-usul: Avtomatik yuklash boshlanmoqda...
echo Agar brauzer yoki oyna ochilsa, GitHub ruxsatini bering.
echo -------------------------------------------------------
echo(
git push -u origin main
if %ERRORLEVEL% EQU 0 goto muvaffaqiyat
echo(
echo [OGOHLANTIRISH] Avtomatik ulanish amalga oshmadi.
echo Keling, 2-usul [GitHub Token] bilan yuklaymiz.
echo(
goto usul2

:usul2
echo(
echo -------------------------------------------------------
echo 2-usul: GitHub Personal Access Token [PAT]
echo -------------------------------------------------------
echo Agar tokeningiz bo'lmasa, quyidagi havola orqali 1 daqiqada oling:
echo https://github.com/settings/tokens/new?scopes=repo
echo [Token nomi: muvozanat, 'repo' ga galochka qo'yib 'Generate token' bosing]
echo(
set /p TOKEN="GitHub Tokeningizni shu yerga kiriting [yoki bekor qilish uchun Enter]: "
if "%TOKEN%"=="" goto tamom

echo(
echo Yuklanmoqda...
git push https://%TOKEN%@github.com/AyubParsaev-1981/muvozanat24.git main
if %ERRORLEVEL% EQU 0 goto muvaffaqiyat
echo [XATO] Token noto'g'ri yoki ruxsat berilmagan.
goto tamom

:usul3
echo(
echo -------------------------------------------------------
echo 3-usul: Brauzer orqali to'g'ridan-to'g'ri yuklash
echo -------------------------------------------------------
echo Brauzerda yuklash sahifasi ochilmoqda...
start https://github.com/AyubParsaev-1981/muvozanat24/upload/main
echo(
echo Ushbu sahifaga loyihaning asosiy fayllarini [index.html, js, css, assets]
echo sudrab olib borib tashlang [Drag and drop] va 'Commit changes' ni bosing!
goto tamom

:muvaffaqiyat
echo(
echo =======================================================
echo [MUVAFFAQIYATLI] Barcha fayllar GitHub ga to'liq yuklandi!
echo(
echo Repozitoriya: https://github.com/AyubParsaev-1981/muvozanat24
echo Jonli veb-sayt: 👉 https://ayubparsaev-1981.github.io/muvozanat24/
echo =======================================================
goto tamom

:tamom
echo(
pause
