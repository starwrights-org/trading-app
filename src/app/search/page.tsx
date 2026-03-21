'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useTheme, themeColors } from '@/lib/theme';

// 所有可搜索的股票
const ALL_STOCKS = [
  // 美股
  { name: '投资组合标普 500 指数 ETF', symbol: 'SPYM', market: 'US', price: 76.330, changePercent: -1.43 },
  { name: '纳斯达克 100 指数 ETF', symbol: 'QQQM', market: 'US', price: 239.640, changePercent: -1.87 },
  { name: '标普 500 ETF - SPDR', symbol: 'SPY', market: 'US', price: 648.570, changePercent: -1.43 },
  { name: '美债市场指数 ETF', symbol: 'BND', market: 'US', price: 73.170, changePercent: -0.80 },
  { name: '纳斯达克综合指数 ETF', symbol: 'ONEQ', market: 'US', price: 85.160, changePercent: -1.99 },
  { name: '纳指 100 ETF - Invesco', symbol: 'QQQ', market: 'US', price: 582.060, changePercent: -1.85 },
  { name: '英伟达', symbol: 'NVDA', market: 'US', price: 172.700, changePercent: -3.28 },
  { name: '阿里巴巴', symbol: 'BABA', market: 'US', price: 122.410, changePercent: -1.99 },
  { name: '苹果', symbol: 'AAPL', market: 'US', price: 247.990, changePercent: -0.39 },
  { name: '特斯拉', symbol: 'TSLA', market: 'US', price: 367.960, changePercent: -3.24 },
  { name: '亚马逊', symbol: 'AMZN', market: 'US', price: 205.370, changePercent: -1.62 },
  { name: '谷歌', symbol: 'GOOGL', market: 'US', price: 301.000, changePercent: -2.00 },
  { name: 'Meta', symbol: 'META', market: 'US', price: 593.660, changePercent: -2.15 },
  { name: '微软', symbol: 'MSFT', market: 'US', price: 388.450, changePercent: -1.12 },
  { name: '摩根大通', symbol: 'JPM', market: 'US', price: 287.970, changePercent: -0.85 },
  { name: '美光科技', symbol: 'MU', market: 'US', price: 98.230, changePercent: -2.45 },
  { name: 'AMD', symbol: 'AMD', market: 'US', price: 112.340, changePercent: -3.12 },
  { name: '博通', symbol: 'AVGO', market: 'US', price: 178.560, changePercent: -1.89 },
  // 港股
  { name: '腾讯控股', symbol: '00700', market: 'HK', price: 508.000, changePercent: -0.59 },
  { name: '阿里巴巴-SW', symbol: '09988', market: 'HK', price: 123.700, changePercent: -1.43 },
  { name: '美团-W', symbol: '03690', market: 'HK', price: 79.150, changePercent: -2.88 },
  { name: '小米集团-W', symbol: '01810', market: 'HK', price: 33.200, changePercent: -2.35 },
  { name: '香港交易所', symbol: '00388', market: 'HK', price: 396.000, changePercent: 1.54 },
  { name: '中国平安', symbol: '02318', market: 'HK', price: 41.850, changePercent: -1.53 },
  { name: '中海油', symbol: '00883', market: 'HK', price: 18.560, changePercent: 0.87 },
  { name: '建设银行', symbol: '00939', market: 'HK', price: 6.450, changePercent: 0.31 },
  { name: '工商银行', symbol: '01398', market: 'HK', price: 5.120, changePercent: 0.59 },
  { name: '汇丰控股', symbol: '00005', market: 'HK', price: 78.350, changePercent: -0.45 },
  { name: '友邦保险', symbol: '01299', market: 'HK', price: 58.900, changePercent: -1.23 },
  { name: '京东集团-SW', symbol: '09618', market: 'HK', price: 145.200, changePercent: -2.15 },
  { name: '网易-S', symbol: '09999', market: 'HK', price: 156.800, changePercent: -0.89 },
  { name: '比亚迪股份', symbol: '01211', market: 'HK', price: 298.400, changePercent: 1.25 },
];

// 热门搜索
const HOT_SEARCHES = ['NVDA', '腾讯', 'TSLA', '阿里巴巴', 'SPY', '小米', 'AAPL', '美团'];

// 搜索历史（模拟）
const SEARCH_HISTORY = ['英伟达', 'QQQ', '00700'];

export default function SearchPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  // 搜索结果
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_STOCKS.filter(stock => 
      stock.name.toLowerCase().includes(q) ||
      stock.symbol.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [query]);

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text}`}>
      {/* 搜索栏 */}
      <div className={`${colors.bg} sticky top-0 z-10 px-4 py-3`}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className={`flex-1 flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
            <svg className={`w-5 h-5 ${colors.textMuted} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="搜索股票代码、名称"
              autoFocus
              className={`flex-1 bg-transparent outline-none ${colors.text} placeholder-gray-500`}
            />
            {query && (
              <button onClick={() => setQuery('')} className={colors.textMuted}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <Link href="/" className="text-blue-500">取消</Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* 有搜索词时显示结果 */}
        {query.trim() ? (
          <div>
            {results.length > 0 ? (
              <div className={`divide-y ${colors.borderLight}`}>
                {results.map(stock => (
                  <Link
                    key={`${stock.market}-${stock.symbol}`}
                    href={`/stock/${stock.market}/${stock.symbol}`}
                    className={`flex items-center justify-between py-4 ${colors.hover}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${colors.text}`}>{stock.name}</span>
                      </div>
                      <div className={`text-sm ${colors.textMuted} flex items-center gap-1`}>
                        <span className="text-blue-500">{stock.market}</span>
                        <span>{stock.symbol}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${colors.text}`}>{stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 ${colors.textMuted}`}>
                <div className="text-4xl mb-4">🔍</div>
                <div>没有找到 "{query}" 相关的股票</div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 搜索历史 */}
            {SEARCH_HISTORY.length > 0 && (
              <div className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`font-medium ${colors.text}`}>搜索历史</h2>
                  <button className={`text-sm ${colors.textMuted}`}>清空</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SEARCH_HISTORY.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(item)}
                      className={`px-3 py-1.5 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} ${colors.textSecondary}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            <div className="py-4">
              <h2 className={`font-medium ${colors.text} mb-3`}>热门搜索</h2>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    className={`px-3 py-1.5 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} ${colors.textSecondary}`}
                  >
                    {idx < 3 && <span className="text-orange-500 mr-1">🔥</span>}
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 热门股票 */}
            <div className="py-4">
              <h2 className={`font-medium ${colors.text} mb-3`}>热门股票</h2>
              <div className={`divide-y ${colors.borderLight}`}>
                {ALL_STOCKS.slice(0, 8).map(stock => (
                  <Link
                    key={`${stock.market}-${stock.symbol}`}
                    href={`/stock/${stock.market}/${stock.symbol}`}
                    className={`flex items-center justify-between py-3 ${colors.hover}`}
                  >
                    <div>
                      <div className={`font-medium ${colors.text}`}>{stock.name}</div>
                      <div className={`text-sm ${colors.textMuted}`}>
                        <span className="text-blue-500">{stock.market}</span> {stock.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${colors.text}`}>{stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
