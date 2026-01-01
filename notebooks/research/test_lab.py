
import pandas as pd
from sqlalchemy import create_engine
import mplfinance as mpf
import os

print("🧪 Testing Ultimate Metron Research Lab inside Docker...")

# 1. DB Connection (Using internal docker hostname 'db')
# Note: 'db' service might not be up if we only started 'research'. 
# But assuming the db is running from previous Setup steps.
db_url = "postgresql://user:pass@db:5432/metron"

try:
    engine = create_engine(db_url)
    conn = engine.connect()
    print("✅ DATABASE CONNECTED: Successfully reached 'db' service!")
    conn.close()
except Exception as e:
    print(f"❌ DB ERROR: {e}")
    print("NOTE: Ensure 'db' service is running (docker-compose up -d db)")

# 2. Chart Test (Dummy Data)
print("📊 Generating Test Chart...")
data = {
    'Date': pd.date_range(start='2025-01-01', periods=10, freq='D'),
    'Open': [100, 102, 101, 103, 105, 104, 106, 108, 107, 110],
    'High': [105, 104, 103, 106, 108, 107, 109, 112, 111, 115],
    'Low': [99, 100, 98, 101, 102, 101, 103, 105, 104, 108],
    'Close': [102, 101, 103, 105, 107, 106, 108, 110, 109, 113],
    'Volume': [1000, 1500, 1200, 1800, 2000, 1600, 2100, 2500, 2200, 3000]
}
df = pd.DataFrame(data).set_index('Date')

# Try plotting - if display is not available (headless), this might just generate object
try:
    # Use 'save' to a file if inline plotting issues occur in pure script run
    mpf.plot(df, type='candle', style='charles', volume=True, title="System Check: OK", savefig='test_chart.png')
    print("✅ Visualization Library Loaded Successfully! Chart saved to test_chart.png")
except Exception as e:
    print(f"❌ Chart Error: {e}")
