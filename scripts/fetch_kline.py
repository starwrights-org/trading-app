#!/usr/bin/env python3
"""
使用长桥 API 获取热门股票的 K 线数据并保存为 JSON
"""
from longport.openapi import QuoteContext, Config, Period, AdjustType
import json
import os

config = Config(
    app_key="bb5627b8cf83fce2ca8747e2cb7ff066",
    app_secret="f8f3000915b3253fdf4ccbada97e88dda14ce64d417646cca597a9050ca05c5f",
    access_token="m_eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5YWRiMGIxYTdlNzYxNzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJsb25nYnJpZGdlIiwic3ViIjoiYWNjZXNzX3Rva2VuIiwiZXhwIjoxNzgwNzUzNjM1LCJpYXQiOjE3NzI5Nzc2MzUsImFrIjoiYmI1NjI3YjhjZjgzZmNlMmNhODc0N2UyY2I3ZmYwNjYiLCJhYWlkIjoyMTMwODQ3MiwiYWMiOiJsYl9wYXBlcnRyYWRpbmciLCJtaWQiOjcyNDU1NTMsInNpZCI6ImNURklWZHZBU254RzN3amRPRldyaFE9PSIsImJsIjowLCJ1bCI6MCwiaWsiOiJsYl9wYXBlcnRyYWRpbmdfMjEzMDg0NzIifQ.RidHuFRzAQiNRWABIffyE7X1xQkbsQOY2SfCc0xuj5svYLFhLHTFFRIS_qz9lfikR9wc5xnlySfz6w8uzM6E1rs1BXlNrLaLJaXM9HtT3je1IslTsK5X-h7iEF2K1iKiidIhk2IBvZ6LvnKzjedNw29DGZKtb5sLBy8Yi7VF0HnO_4hnJnkVvxK_oaHMZd04CHXcZ-HRQ6B4k0xWnic4Qvbq6cysLflGJ-43KBw9cPHxqxX38DGIVvsXB1sI5DEEY3VxqVJgev_GP2J-CcYtvURM8jT1d29j1O9GFTaCqpnj3S9VQOpyGBS6UZYznsE8vjoMT6jfI03EYSrl6jBbYpQNvJSQe3bqHeJGaHeq5PgdShsDB1hLvB4stATD8L8Zl-bOEYX5bF1Dw1PtQr0QNUXGs-v-LNG52WPr_m7S6VFEk_YJuhf7TYA8ypGo4mWWZQY2ZK_suoe9JhY9nL3A1BMJDWv7_w54YvBbsSWubPPjGdvvdV_HIuUHZkq1TPkJahR7643MU1Ta4OSyo_SIQ5qyBI6u66rfSQyrCpfeSXdZ1BcbtGK14SHo7UCguAQH9lzbK6NPpwnIjENht7FFz7cAJDHaDsY1RiCPr0GMu7Ik57c-BspVKIRTusC4RGRBKKUO85SmeoZc4qIbdZoZJiwk0XYa-YQ8YB1AE_IeiIU"
)

# 热门股票列表
SYMBOLS = [
    # 港股
    "00700.HK", "09988.HK", "03690.HK", "01810.HK", "00388.HK", "02318.HK",
    "00883.HK", "00708.HK", "06666.HK", "00175.HK", "09999.HK", "00241.HK",
    # 美股
    "AAPL.US", "NVDA.US", "TSLA.US", "AMZN.US", "GOOGL.US", "META.US",
    "BABA.US", "JD.US", "PDD.US", "MSFT.US", "AMD.US", "SPY.US",
]

ctx = QuoteContext(config)

script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, '..', 'public', 'data', 'kline')
os.makedirs(output_dir, exist_ok=True)

print(f"📊 获取 {len(SYMBOLS)} 只股票的 K 线数据...")
print("=" * 60)

success = 0
failed = 0

for symbol in SYMBOLS:
    try:
        # 获取最近60天日K线
        klines = ctx.candlesticks(symbol, Period.Day, 60, AdjustType.ForwardAdjust)
        
        # 转换为 JSON 格式
        data = []
        for k in klines:
            data.append({
                'time': k.timestamp.strftime('%Y-%m-%d'),
                'open': float(k.open),
                'high': float(k.high),
                'low': float(k.low),
                'close': float(k.close),
                'volume': int(k.volume),
            })
        
        # 保存文件
        symbol_clean = symbol.replace('.', '_')
        filepath = os.path.join(output_dir, f'{symbol_clean}.json')
        with open(filepath, 'w') as f:
            json.dump(data, f)
        
        print(f"✓ {symbol:12} | {len(data)} 条K线")
        success += 1
        
    except Exception as e:
        print(f"✗ {symbol:12} | 错误: {e}")
        failed += 1

print("=" * 60)
print(f"✅ 成功: {success}, ❌ 失败: {failed}")
print(f"📁 保存到: {output_dir}")
