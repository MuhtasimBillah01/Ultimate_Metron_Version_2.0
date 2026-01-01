from fastapi import APIRouter
from utils.market_calendar import is_trading_day
import psutil

router = APIRouter(prefix="/status", tags=["status"])

@router.get("/")
async def get_status():
    cpu_usage = psutil.cpu_percent()
    ram_usage = psutil.virtual_memory().percent
    
    return {
        "botStatus": "running",  # From global state or DB
        "pnL": 1240.50,  # Mock, from DB
        "marketOpen": is_trading_day(),
        "systemHealth": {"cpu": cpu_usage, "ram": ram_usage}, 
    }
