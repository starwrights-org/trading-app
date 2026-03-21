#!/usr/bin/env python3
"""
使用长桥 API 批量更新股票价格
"""
from longport.openapi import QuoteContext, Config
import json
import os
import time

# 长桥 API 配置
config = Config(
    app_key="bb5627b8cf83fce2ca8747e2cb7ff066",
    app_secret="f8f3000915b3253fdf4ccbada97e88dda14ce64d417646cca597a9050ca05c5f",
    access_token="m_eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5YWRiMGIxYTdlNzYxNzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJsb25nYnJpZGdlIiwic3ViIjoiYWNjZXNzX3Rva2VuIiwiZXhwIjoxNzgwNzUzNjM1LCJpYXQiOjE3NzI5Nzc2MzUsImFrIjoiYmI1NjI3YjhjZjgzZmNlMmNhODc0N2UyY2I3ZmYwNjYiLCJhYWlkIjoyMTMwODQ3MiwiYWMiOiJsYl9wYXBlcnRyYWRpbmciLCJtaWQiOjcyNDU1NTMsInNpZCI6ImNURklWZHZBU254RzN3amRPRldyaFE9PSIsImJsIjowLCJ1bCI6MCwiaWsiOiJsYl9wYXBlcnRyYWRpbmdfMjEzMDg0NzIifQ.RidHuFRzAQiNRWABIffyE7X1xQkbsQOY2SfCc0xuj5svYLFhLHTFFRIS_qz9lfikR9wc5xnlySfz6w8uzM6E1rs1BXlNrLaLJaXM9HtT3je1IslTsK5X-h7iEF2K1iKiidIhk2IBvZ6LvnKzjedNw29DGZKtb5sLBy8Yi7VF0HnO_4hnJnkVvxK_oaHMZd04CHXcZ-HRQ6B4k0xWnic4Qvbq6cysLflGJ-43KBw9cPHxqxX38DGIVvsXB1sI5DEEY3VxqVJgev_GP2J-CcYtvURM8jT1d29j1O9GFTaCqpnj3S9VQOpyGBS6UZYznsE8vjoMT6jfI03EYSrl6jBbYpQNvJSQe3bqHeJGaHeq5PgdShsDB1hLvB4stATD8L8Zl-bOEYX5bF1Dw1PtQr0QNUXGs-v-LNG52WPr_m7S6VFEk_YJuhf7TYA8ypGo4mWWZQY2ZK_suoe9JhY9nL3A1BMJDWv7_w54YvBbsSWubPPjGdvvdV_HIuUHZkq1TPkJahR7643MU1Ta4OSyo_SIQ5qyBI6u66rfSQyrCpfeSXdZ1BcbtGK14SHo7UCguAQH9lzbK6NPpwnIjENht7FFz7cAJDHaDsY1RiCPr0GMu7Ik57c-BspVKIRTusC4RGRBKKUO85SmeoZc4qIbdZoZJiwk0XYa-YQ8YB1AE_IeiIU"
)

# 读取股票列表
script_dir = os.path.dirname(os.path.abspath(__file__))
stocks_path = os.path.join(script_dir, '..', 'public', 'data', 'stocks.json')

with open(stocks_path, 'r') as f:
    stocks = json.load(f)

print(f"📊 总共 {len(stocks)} 只股票")

# 分离港股和美股
hk_stocks = [s for s in stocks if s['market'] == 'HK']
us_stocks = [s for s in stocks if s['market'] == 'US']

print(f"🇭🇰 港股: {len(hk_stocks)} 只")
print(f"🇺🇸 美股: {len(us_stocks)} 只")

# 初始化 API
ctx = QuoteContext(config)

# 批量获取行情 (每批最多 500 个)
BATCH_SIZE = 500
updated_count = 0
failed_count = 0

# 创建 symbol -> stock 的映射
stock_map = {s['symbol']: s for s in stocks}

def fetch_quotes(symbols_list, market_suffix):
    """批量获取行情"""
    global updated_count, failed_count
    
    for i in range(0, len(symbols_list), BATCH_SIZE):
        batch = symbols_list[i:i+BATCH_SIZE]
        api_symbols = [f"{s['symbol']}.{market_suffix}" for s in batch]
        
        try:
            quotes = ctx.quote(api_symbols)
            
            for q in quotes:
                symbol = q.symbol.replace('.HK', '').replace('.US', '')
                if symbol in stock_map:
                    stock = stock_map[symbol]
                    
                    # 计算涨跌
                    price = float(q.last_done) if q.last_done else 0
                    prev_close = float(q.prev_close) if q.prev_close else 0
                    change = price - prev_close if prev_close else 0
                    change_pct = (change / prev_close * 100) if prev_close else 0
                    
                    # 更新数据
                    stock['price'] = round(price, 3)
                    stock['change'] = round(change, 3)
                    stock['changePercent'] = round(change_pct, 2)
                    stock['prevClose'] = round(prev_close, 3)
                    stock['open'] = round(float(q.open), 3) if q.open else 0
                    stock['high'] = round(float(q.high), 3) if q.high else 0
                    stock['low'] = round(float(q.low), 3) if q.low else 0
                    stock['volume'] = int(q.volume) if q.volume else 0
                    
                    updated_count += 1
            
            print(f"  ✓ 批次 {i//BATCH_SIZE + 1}: 获取 {len(quotes)} 只")
            
        except Exception as e:
            print(f"  ✗ 批次 {i//BATCH_SIZE + 1} 失败: {e}")
            failed_count += len(batch)
        
        # 避免 API 限流
        time.sleep(0.5)

print("\n🇭🇰 获取港股行情...")
fetch_quotes(hk_stocks, 'HK')

print("\n🇺🇸 获取美股行情...")
fetch_quotes(us_stocks, 'US')

# 保存更新后的数据
output_path = os.path.join(script_dir, '..', 'public', 'data', 'stocks.json')
with open(output_path, 'w') as f:
    json.dump(stocks, f, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"✅ 更新完成!")
print(f"   成功: {updated_count} 只")
print(f"   失败: {failed_count} 只")
print(f"   保存到: {output_path}")
print(f"{'='*60}")
