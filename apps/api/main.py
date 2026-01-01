from fastapi import FastAPI
from routers import config, bot, status
from ws import logs, control_center
from core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Include provided routers
app.include_router(config.router)
app.include_router(bot.router)
app.include_router(status.router)
app.include_router(logs.router)
app.include_router(control_center.router)

# Note: previous main.py had api_router from api.v1.api. 
# If that is still needed, we should keep it. 
# The user instruction was "main.py update koro routers include koro".
# Assuming the user wants to ADD the new routers to the existing ones if they don't conflict, 
# or essentially replace the structure if the new one is the primary one.
# Given the user provided a full snippet for main.py:
# from fastapi import FastAPI
# from routers import config, bot, status
# from ws import logs
# app = FastAPI()
# app.include_router(config.router) ... etc.
# I will attempt to preserve the existing 'core.config' import if compatible, or just stick to user's requested structure plus any critical things.
# However, the user snippet was simpler. I'll make it robust by adding CORS probably if needed, but sticking to instructions:
# I will follow strictly the user's snippet but add the imported settings to keep title correct.

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
