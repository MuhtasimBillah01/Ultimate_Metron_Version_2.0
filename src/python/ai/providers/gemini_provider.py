import os
import google.generativeai as genai
from src.python.ai.core.provider_interface import BaseAIProvider
import json

import time

class GeminiProvider(BaseAIProvider):
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env")
        
        genai.configure(api_key=api_key)
        # Using Flash for speed and free tier efficiency
        self.model = genai.GenerativeModel('gemini-flash-latest')
        
        # Cache Storage: { "key": {"data": ..., "timestamp": ...} }
        self.cache = {}
        self.CACHE_DURATION = 25 * 60  # 25 minutes in seconds

    def get_name(self) -> str:
        return "Gemini 1.5 Flash (Free Tier)"

    def _get_cached_or_call(self, key: str, api_call_func):
        """Helper to check cache before calling API"""
        current_time = time.time()
        
        if key in self.cache:
            cached_item = self.cache[key]
            age = current_time - cached_item["timestamp"]
            if age < self.CACHE_DURATION:
                print(f"  [CACHE HIT] Returning saved data for '{key}' (Age: {int(age/60)}m)")
                return cached_item["data"]
        
        # If not in cache or expired
        print(f"  [API CALL] Requesting fresh data for '{key}'...")
        try:
            result = api_call_func()
            self.cache[key] = {
                "data": result,
                "timestamp": current_time
            }
            return result
        except Exception as e:
            print(f"  [API ERROR] {e}")
            # If API fails but we have stale cache, maybe return it? 
            # For now, let's just return a safe default via the caller's exception handler
            raise e

    async def analyze_sentiment(self, text: str) -> dict:
        def _call():
            prompt = f"""
            Analyze the sentiment of this crypto news/tweet: "{text}".
            Return ONLY a JSON with keys: "score" (float -1.0 to 1.0) and "label" (Positive/Negative/Neutral).
            """
            response = self.model.generate_content(prompt)
            cleaned_text = response.text.replace('```json', '').replace('```', '')
            return json.loads(cleaned_text)

        try:
            # Create a unique key based on the text content
            key = f"sentiment_{hash(text)}"
            return self._get_cached_or_call(key, _call)
        except Exception as e:
            print(f"Gemini Sentiment Error: {e}")
            return {"score": 0.0, "label": "Neutral"}

    async def analyze_pattern(self, ohlcv_data: list) -> dict:
        def _call():
            # Converting list to string for prompt
            data_str = str(ohlcv_data[-20:]) # Last 20 candles
            prompt = f"""
            Act as a Technical Analyst. Here is the recent OHLCV data: {data_str}.
            Identify any candlestick patterns. Return ONLY JSON: {{"pattern": "name", "signal": "bullish/bearish/none"}}
            """
            response = self.model.generate_content(prompt)
            cleaned_text = response.text.replace('```json', '').replace('```', '')
            return json.loads(cleaned_text)

        try:
            # Key based on the last timestamp of data to ensure freshness if data changes
            # Assuming ohlcv_data is list of lists, taking the last candle's close or time would be good.
            # For simplicity, hashing the string representation of the last 5 candles.
            last_5 = str(ohlcv_data[-5:])
            key = f"pattern_{hash(last_5)}"
            return self._get_cached_or_call(key, _call)
        except Exception as e:
            return {"pattern": "Unknown", "signal": "none"}

    async def check_risk(self, portfolio_context: dict) -> dict:
        def _call():
            prompt = f"Act as a Risk Officer. Context: {portfolio_context}. Should we approve this trade? Return JSON: {{'approved': true/false, 'reason': '...'}}"
            response = self.model.generate_content(prompt)
            cleaned_text = response.text.replace('```json', '').replace('```', '')
            return json.loads(cleaned_text)
        
        try:
            # Key based on portfolio context
            key = f"risk_{hash(str(portfolio_context))}"
            return self._get_cached_or_call(key, _call)
        except Exception:
            return {"approved": False, "reason": "AI Error"}

    async def make_decision(self, analysis_data: dict) -> str:
        def _call():
            prompt = f"Based on this analysis: {analysis_data}, what is the signal? Return ONLY one word: BUY, SELL, or HOLD."
            response = self.model.generate_content(prompt)
            return response.text.strip().upper()
            
        try:
            key = f"decision_{hash(str(analysis_data))}"
            return self._get_cached_or_call(key, _call)
        except:
            return "HOLD"
