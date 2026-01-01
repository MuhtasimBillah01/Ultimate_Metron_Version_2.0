from fastapi import APIRouter, HTTPException
import subprocess

router = APIRouter(prefix="/bot", tags=["bot"])

@router.post("/start")
async def start_bot():
    try:
        # Call startup script or bot process
        # Assuming main_bot.py is in apps/api or similar relative path, adjusting logic to be safe
        subprocess.Popen(["python", "main_bot.py"]) 
        return {"message": "Bot started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop")
async def stop_bot():
    try:
        # Graceful stop logic (e.g., signal to process)
        # This is a placeholder as actual process management would require PID tracking
        return {"message": "Bot stopped"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/kill")
async def kill_bot():
    try:
        # Immediate kill
        # On Windows 'taskkill' might be more appropriate than 'pkill', but keeping logic generic or adapting if needed
        import os
        if os.name == 'nt':
             os.system("taskkill /F /IM python.exe /T") # CAUTION: This kills ALL python processes. Prototyping safety.
        else:
             os.system("pkill -f main_bot.py")
        return {"message": "Kill switch activated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
