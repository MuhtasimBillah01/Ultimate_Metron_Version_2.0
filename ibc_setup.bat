@echo off
setlocal

:: --- CONFIGURATION VARIABLES ---
set "BASE_DIR=C:\Metron_Trade"
set "IBC_DIR=%BASE_DIR%\IBC"
set "LOG_DIR=%BASE_DIR%\Logs"
set "IB_GATEWAY_PATH=C:\Jts"

:: --- HEADER ---
echo ========================================================
echo   ULTIMATE METRON - IBC AUTOMATION SETUP
echo   Target: Forex/Stock Logic (Paper Trading)
echo ========================================================

:: 1. Create Directory Structure
if not exist "%BASE_DIR%" mkdir "%BASE_DIR%"
if not exist "%IBC_DIR%" mkdir "%IBC_DIR%"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
echo [INFO] Log directory created at: %LOG_DIR%

:: 2. Generate config.ini (The BRAIN of IBC)
:: This file controls how the gateway behaves.
echo [INFO] Generating config.ini...

(
echo [IBC]
echo ; --- Authentication ---
echo ; IMPORTANT: Edit this file later to add your real IBKR Username/Password
echo IbLoginId=REPLACE_WITH_YOUR_USERNAME
echo IbPassword=REPLACE_WITH_YOUR_PASSWORD
echo TradingMode=paper
echo IbDir=%IB_GATEWAY_PATH%
echo.
echo ; --- Gateway Settings ---
echo ; Preventing auto-restart disruptions
echo ExistingSessionDetectedAction=primary
echo AcceptIncomingConnectionAction=accept
echo ShowAllTrades=yes
echo ForceTwsApiPort=7497
echo.
echo ; --- Timer & Automation ---
echo ; Closedown time for daily reset (e.g., Friday night)
echo ClosedownAt=Friday 23:59
echo.
echo ; --- Logging ---
echo LogFile=%LOG_DIR%\IBC_Log.txt
) > "%IBC_DIR%\config.ini"

echo [SUCCESS] config.ini generated inside %IBC_DIR%

:: 3. Generate StartGateway.bat (The STARTER)
:: This is the file you will put in Task Scheduler later.
echo [INFO] Generating StartGateway.bat...

(
echo @echo off
echo echo Starting IB Gateway via IBC...
echo cd /d "%IBC_DIR%"
echo %%IBC_DIR%%\scripts\StartGateway.bat "%%IBC_DIR%%\config.ini"
) > "%BASE_DIR%\Start_Metron_Gateway.bat"

echo [SUCCESS] Start_Metron_Gateway.bat created at %BASE_DIR%

:: --- INSTRUCTIONS ---
echo.
echo ========================================================
echo   SETUP COMPLETE! NEXT STEPS:
echo ========================================================
echo 1. Go to: %IBC_DIR%
echo 2. Open 'config.ini' with Notepad.
echo 3. Replace 'REPLACE_WITH_YOUR_USERNAME' and 'PASSWORD' with your IBKR info.
echo 4. Save and close.
echo 5. To start the bot, run: %BASE_DIR%\Start_Metron_Gateway.bat
echo ========================================================
pause
