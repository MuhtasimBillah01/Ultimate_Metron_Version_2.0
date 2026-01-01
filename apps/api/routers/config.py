from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv, set_key
import os

router = APIRouter(prefix="/config", tags=["config"])

class BotConfig(BaseModel):
    exchangeType: str
    exchangeName: str
    riskLimit: float
    maxDrawdown: float
    strategyMode: str
    # Future fields: dynamically added

@router.get("/")
async def get_config():
    load_dotenv()
    return {
        "exchangeType": os.getenv("EXCHANGE_TYPE", "crypto"),
        "exchangeName": os.getenv("EXCHANGE_NAME", "Binance"),
        "riskLimit": float(os.getenv("RISK_LIMIT", 2.0)),
        "maxDrawdown": float(os.getenv("MAX_DRAWDOWN", 20.0)),
        "strategyMode": os.getenv("STRATEGY_MODE", "hybrid"),
    }

@router.post("/")
async def save_config(config: BotConfig):
    try:
        env_file = ".env"
        # Ensure .env exists
        if not os.path.exists(env_file):
            with open(env_file, 'w') as f:
                f.write("")
        
        set_key(env_file, "EXCHANGE_TYPE", config.exchangeType)
        set_key(env_file, "EXCHANGE_NAME", config.exchangeName)
        set_key(env_file, "RISK_LIMIT", str(config.riskLimit))
        set_key(env_file, "MAX_DRAWDOWN", str(config.maxDrawdown))
        set_key(env_file, "STRATEGY_MODE", config.strategyMode)
        # Optional: restart bot logic here
        return {"message": "Config saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
