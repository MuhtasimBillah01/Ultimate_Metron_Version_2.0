import json
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
import logging
import asyncio

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()  # All clients
        self.channels: Dict[str, Set[WebSocket]] = {
            "logs": set(),
            "pnl": set(),
            "status": set(),
            # Future: "alerts": set(), "trades": set() – add easily
        }

    async def connect(self, websocket: WebSocket, channel: str = "all"):
        await websocket.accept()
        self.active_connections.add(websocket)
        if channel == "all":
            for ch in self.channels:
                self.channels[ch].add(websocket)
        elif channel in self.channels:
            self.channels[channel].add(websocket)

    def disconnect(self, websocket: WebSocket, channel: str = "all"):
        self.active_connections.discard(websocket)
        if channel == "all":
            for ch in self.channels:
                self.channels[ch].discard(websocket)
        elif channel in self.channels:
            self.channels[channel].discard(websocket)

    async def broadcast(self, message: dict, channel: str = "logs"):
        """Broadcast to specific channel or all"""
        data = json.dumps(message)
        disconnected = set()
        targets = self.channels.get(channel, self.active_connections)
        for connection in targets:
            try:
                await connection.send_text(data)
            except WebSocketDisconnect:
                disconnected.add(connection)
            except Exception as e:
                logger.error(f"Error sending message to {connection}: {e}")
                disconnected.add(connection)
        
        # Clean up disconnected
        for conn in disconnected:
            self.disconnect(conn, channel if channel in self.channels else "all")

    async def send_personal(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_text(json.dumps(message))
        except RuntimeError:
            # WebSocket might be closed already
            pass

# Global manager instance
manager = ConnectionManager()
