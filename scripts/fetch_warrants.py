#!/usr/bin/env python3
"""
从长桥 API 获取热门港股的窝轮牛熊证数据
"""
from longport.openapi import QuoteContext, Config, WarrantSortBy, SortOrderType
import json
import os

config = Config(
    app_key="bb5627b8cf83fce2ca8747e2cb7ff066",
    app_secret="f8f3000915b3253fdf4ccbada97e88dda14ce64d417646cca597a9050ca05c5f",
    access_token="m_eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5YWRiMGIxYTdlNzYxNzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJsb25nYnJpZGdlIiwic3ViIjoiYWNjZXNzX3Rva2VuIiwiZXhwIjoxNzgwNzUzNjM1LCJpYXQiOjE3NzI5Nzc2MzUsImFrIjoiYmI1NjI3YjhjZjgzZmNlMmNhODc0N2UyY2I3ZmYwNjYiLCJhYWlkIjoyMTMwODQ3MiwiYWMiOiJsYl9wYXBlcnRyYWRpbmciLCJtaWQiOjcyNDU1NTMsInNpZCI6ImNURklWZHZBU254RzN3amRPRldyaFE9PSIsImJsIjowLCJ1bCI6MCwiaWsiOiJsYl9wYXBlcnRyYWRpbmdfMjEzMDg0NzIifQ.RidHuFRzAQiNRWABIffyE7X1xQkbsQOY2SfCc0xuj5svYLFhLHTFFRIS_qz9lfikR9wc5xnlySfz6w8uzM6E1rs1BXlNrLaLJaXM9HtT3je1IslTsK5X-h7iEF2K1iKiidIhk2IBvZ6LvnKzjedNw29DGZKtb5sLBy8Yi7VF0HnO_4hnJnkVvxK_oaHMZd04CHXcZ-HRQ6B4k0xWnic4Qvbq6cysLflGJ-43KBw9cPHxqxX38DGIVvsXB1sI5DEEY3VxqVJgev_GP2J-CcYtvURM8jT1d29j1O9GFTaCqpnj3S9VQOpyGBS6UZYznsE8vjoMT6jfI03EYSrl6jBbYpQNvJSQe3bqHeJGaHeq5PgdShsDB1hLvB4stATD8L8Zl-bOEYX5bF1Dw1PtQr0QNUXGs-v-LNG52WPr_m7S6VFEk_YJuhf7TYA8ypGo4mWWZQY2ZK_suoe9JhY9nL3A1BMJDWv7_w54YvBbsSWubPPjGdvvdV_HIuUHZkq1TPkJahR7643MU1Ta4OSyo_SIQ5qyBI6u66rfSQyrCpfeSXdZ1BcbtGK14SHo7UCguAQH9lzbK6NPpwnIjENht7FFz7cAJDHaDsY1RiCPr0GMu7Ik57c-BspVKIRTusC4RGRBKKUO85SmeoZc4qIbdZoZJiwk0XYa-YQ8YB1AE_IeiIU"
)

# 热门港股 (有窝轮的)
HOT_STOCKS = [
    "00700", "09988", "03690", "01810", "00388", "02318",
    "00883", "00175", "09618", "09888", "00941", "02269",
    "01211", "00005", "02020", "00027", "01299", "00066",
    "09999", "09992", "01024", "02382", "00267", "00857",
]

ctx = QuoteContext(config)

script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, '..', 'public', 'data', 'warrants')
os.makedirs(output_dir, exist_ok=True)

print(f"📊 获取 {len(HOT_STOCKS)} 只热门港股的窝轮数据...")
print("=" * 60)

for symbol in HOT_STOCKS:
    try:
        warrants = ctx.warrant_list(f"{symbol}.HK", WarrantSortBy.Volume, SortOrderType.Descending)
        
        # 转换为 JSON 格式
        data = []
        for w in warrants[:100]:  # 只取前 100 只
            # 判断类型
            wtype = str(w.warrant_type)
            if 'Call' in wtype:
                type_code = 'call'
            elif 'Put' in wtype:
                type_code = 'put'
            elif 'Bull' in wtype:
                type_code = 'bull'
            elif 'Bear' in wtype:
                type_code = 'bear'
            else:
                type_code = 'other'
            
            data.append({
                'symbol': w.symbol.replace('.HK', ''),
                'name': str(w.name),
                'lastDone': float(w.last_done) if w.last_done else 0,
                'changePercent': round(float(w.change_rate) * 100, 2) if w.change_rate else 0,
                'volume': int(w.volume) if w.volume else 0,
                'strikePrice': float(w.strike_price) if w.strike_price else 0,
                'expiryDate': str(w.expiry_date) if w.expiry_date else '',
                'type': type_code,
                'premium': round(float(w.premium) * 100, 2) if w.premium else 0,
                'leverage': round(float(w.leverage_ratio), 1) if w.leverage_ratio else 0,
            })
        
        # 保存文件
        filepath = os.path.join(output_dir, f'{symbol}.json')
        with open(filepath, 'w') as f:
            json.dump(data, f, ensure_ascii=False)
        
        print(f"✓ {symbol} | 共 {len(warrants)} 只，保存前 {len(data)} 只")
        
    except Exception as e:
        print(f"✗ {symbol} | 错误: {e}")

print("=" * 60)
print(f"✅ 完成！保存到: {output_dir}")
