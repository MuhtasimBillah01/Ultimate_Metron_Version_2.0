import os
# Try to load .env if dotenv is installed, otherwise rely on system env
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from src.python.ai.providers.gemini_provider import GeminiProvider
from src.python.ai.providers.deepseek_provider import DeepSeekProvider

class HybridBrain:
    def __init__(self):
        print("🧠 Initializing Ultimate Metron Hybrid Brain...")
        
        # 1. Load Providers
        self.gemini = GeminiProvider()
        
        # Check if DeepSeek is available (Future Proofing)
        self.deepseek = None
        if os.getenv("DEEPSEEK_API_KEY"):
            try:
                self.deepseek = DeepSeekProvider()
                print("🚀 DeepSeek Module Activated!")
            except Exception as e:
                print(f"⚠️ DeepSeek config found but failed to load: {e}")

        # 2. Assign Roles (Dynamic 5-Slot Architecture)
        self.roles = {
            # Slot 1: Scout (Always Gemini Free for low cost)
            "scout": self.gemini,

            # Slot 2: Strategist (DeepSeek if available, else Gemini)
            "strategist": self.deepseek if self.deepseek else self.gemini,

            # Slot 3: Validator (Ideally Claude, falling back to Gemini)
            "validator": self.gemini, 

            # Slot 4: Risk Officer (Ideally GPT-4, falling back to Gemini)
            "risk_officer": self.gemini,

            # Slot 5: Local Backup (Not implemented yet)
            "backup": None 
        }

        self._log_role_assignments()

    def _log_role_assignments(self):
        print("\n📋 AI Role Assignments:")
        for role, provider in self.roles.items():
            name = provider.get_name() if provider else "None"
            print(f"  - {role.upper()}: Managed by {name}")
        print("-" * 30)

    # --- Public Methods called by the Trading Engine ---

    async def get_market_sentiment(self, news_text: str):
        """Uses the 'SCOUT' role"""
        return await self.roles['scout'].analyze_sentiment(news_text)

    async def analyze_chart_pattern(self, ohlcv_data: list):
        """Uses the 'STRATEGIST' role"""
        return await self.roles['strategist'].analyze_pattern(ohlcv_data)

    async def validate_trade_risk(self, portfolio_data: dict):
        """Uses the 'RISK_OFFICER' role"""
        return await self.roles['risk_officer'].check_risk(portfolio_data)

    async def get_final_decision(self, aggregated_data: dict):
        """
        Uses 'STRATEGIST' to decide, and 'VALIDATOR' to cross-check (Future).
        For now, simplistic flow.
        """
        decision = await self.roles['strategist'].make_decision(aggregated_data)
        return decision

# --- Execution Test (Run this file directly to test) ---
if __name__ == "__main__":
    import asyncio
    
    async def test_brain():
        brain = HybridBrain()
        
        # Test 1: Sentiment (Scout)
        print("\n🧪 Testing Scout (Sentiment)...")
        sent = await brain.get_market_sentiment("Bitcoin hits all time high as inflation drops!")
        print(f"Result: {sent}")

        # Test 2: Strategy (Strategist)
        print("\n🧪 Testing Strategist (Pattern)...")
        # Fake OHLCV data
        dummy_data = [[100, 102, 99, 101, 500], [101, 105, 100, 104, 600]] 
        pattern = await brain.analyze_chart_pattern(dummy_data)
        print(f"Result: {pattern}")

    # Run loop
    asyncio.run(test_brain())
