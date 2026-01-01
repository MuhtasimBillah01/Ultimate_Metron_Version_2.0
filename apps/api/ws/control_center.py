from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .manager import manager

router = APIRouter()

@router.websocket("/ws/control-center")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket, channel="all")
    try:
        while True:
            data = await websocket.receive_text()  # Optional: client can send commands
            # Future: handle commands like "subscribe:alerts"
            await manager.send_personal({"type": "echo", "data": data}, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel="all")
