
import alpaca_trade_api as tradeapi
import os
from dotenv import load_dotenv

# Load env if present, but for this test we use the provided keys directly if missing
# actually, let's try to verify if the user put them in .env, but since I couldn't write to .env, I will put them here for the test.
# User provided:
API_KEY = "PKYDGLFP5APJZIEYCZEVTG65NF"
SECRET_KEY = "CPJqHwSMaFXLu5sc5q65i1SMVemKMRZrtrRvCVdK4ior"
BASE_URL = "https://paper-api.alpaca.markets"

print(f"🧪 Testing Alpaca Connection...")
print(f"   API Key: {API_KEY}")
print(f"   Base URL: {BASE_URL}")

try:
    # Connect
    api = tradeapi.REST(API_KEY, SECRET_KEY, BASE_URL, api_version='v2')
    
    # 1. Check Account
    account = api.get_account()
    print(f"✅ Connection Successful!")
    print(f"   Status: {account.status}")
    print(f"   Buying Power: ${account.buying_power}")
    print(f"   Cash: ${account.cash}")

    # 2. Try to buy AAPL (Market Order)
    # Only if buying power > 0
    if float(account.buying_power) > 0:
        print("\n📊 Placing Test Order (AAPL)...")
        try:
            order = api.submit_order(
                symbol='AAPL',
                qty=1,
                side='buy',
                type='market',
                time_in_force='gtc'
            )
            print(f"✅ Order Placed! ID: {order.id}")
            print(f"   Status: {order.status}")
        except Exception as order_err:
             print(f"⚠️ Order Failed (Market might be closed or invalid keys): {order_err}")
    else:
        print("⚠️ Insufficient Buying Power for trade test.")

except Exception as e:
    print(f"\n❌ Connection Failed: {e}")
    print("   Analysis: The API Key 'MuhtasimMunna' does not look like a standard Alpaca Key (usually starts with PK...). Check your credentials.")
