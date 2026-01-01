from fastapi import APIRouter, WebSocket
import asyncio

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Simulate log stream (from queue or file tail)
            # In a real scenario, this would subscribe to a log queue
            await websocket.send_text("Log: New trade executed")
            await asyncio.sleep(1)
    except Exception:
        # Client likely disconnected
        await websocket.close()
