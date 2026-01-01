import os
import requests
from src.python.ai.core.provider_interface import BaseAIProvider
import json

class DeepSeekProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        # Note: We don't raise error here, because Orchestrator handles the fallback
        self.api_url = "https://api.deepseek.com/v1/chat/completions" # Example URL

    def get_name(self) -> str:
        return "DeepSeek V3 (Strategist)"

    def _call_api(self, prompt):
        if not self.api_key:
            raise RuntimeError("DeepSeek API Key missing")
        
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}]
        }
        response = requests.post(self.api_url, json=payload, headers=headers)
        return response.json()['choices'][0]['message']['content']

    async def analyze_sentiment(self, text: str) -> dict:
        # DeepSeek is better at nuance
        prompt = f"Deep analyze sentiment: {text}. JSON format: {{'score': float, 'label': str}}"
        resp = self._call_api(prompt)
        return json.loads(resp)

    async def analyze_pattern(self, ohlcv_data: list) -> dict:
        # DeepSeek V3 excels at math/logic
        prompt = f"Analyze OHLCV math patterns: {str(ohlcv_data)}. JSON format."
        resp = self._call_api(prompt)
        return json.loads(resp)

    # ... Implement other methods similarly ...
    async def check_risk(self, portfolio_context: dict) -> dict:
        return {"approved": True, "reason": "Not implemented yet"}

    async def make_decision(self, analysis_data: dict) -> str:
        return "HOLD"
