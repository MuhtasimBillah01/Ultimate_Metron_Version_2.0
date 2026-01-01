from datetime import datetime

def is_trading_day():
    """
    Checks if today is a trading day.
    This is a mock implementation. In minimal viable product, crypto is 24/7.
    If stocks, we would check weekends/holidays.
    """
    # Crypto markets are always open
    return True
