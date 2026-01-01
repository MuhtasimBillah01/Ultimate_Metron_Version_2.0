from abc import ABC, abstractmethod

class BaseAIProvider(ABC):
    """
    Base Interface for all AI Models (Gemini, DeepSeek, GPT, etc.)
    Every provider must implement these methods.
    """
    
    @abstractmethod
    def get_name(self) -> str:
        """Returns the name of the provider (e.g., 'Gemini Flash', 'DeepSeek V3')"""
        pass

    @abstractmethod
    async def analyze_sentiment(self, text: str) -> dict:
        """Analyzes text and returns sentiment score (-1 to 1) and classification."""
        pass

    @abstractmethod
    async def analyze_pattern(self, ohlcv_data: list) -> dict:
        """Analyzes market data (OHLCV) for patterns."""
        pass

    @abstractmethod
    async def check_risk(self, portfolio_context: dict) -> dict:
        """Evaluates risk based on portfolio size and market conditions."""
        pass

    @abstractmethod
    async def make_decision(self, analysis_data: dict) -> str:
        """Final decision maker: Returns BUY, SELL, or HOLD."""
        pass
