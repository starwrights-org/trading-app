'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useTheme, themeColors } from '@/lib/theme';

// 股票类型
interface Stock {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  sector?: string;
  alias?: string; // 中文别名
}

// 热门搜索
const HOT_SEARCHES = ['NVDA', '腾讯', 'TSLA', '阿里巴巴', 'SPY', '小米', 'AAPL', '美团', 'QQQ', '00700'];

// 搜索历史（模拟）
const SEARCH_HISTORY = ['英伟达', 'QQQ', '00700'];

// 数据版本（用于缓存破解）
const DATA_VERSION = '20260321v3';

export default function SearchPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [query, setQuery] = useState('');
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockCount, setStockCount] = useState(0);

  // 加载股票数据
  useEffect(() => {
    fetch(`/trading-app/data/stocks.json?v=${DATA_VERSION}`)
      .then(res => res.json())
      .then(data => {
        setAllStocks(data);
        setStockCount(data.length);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载股票数据失败:', err);
        setLoading(false);
      });
  }, []);

  // 搜索结果
  const results = useMemo(() => {
    if (!query.trim() || allStocks.length === 0) return [];
    const q = query.toLowerCase();
    return allStocks.filter(stock => 
      stock.name.toLowerCase().includes(q) ||
      stock.symbol.toLowerCase().includes(q) ||
      (stock.alias && stock.alias.toLowerCase().includes(q))
    ).slice(0, 50);
  }, [query, allStocks]);

  // 热门股票（加载完成后显示）
  const hotStocks = useMemo(() => {
    return allStocks.slice(0, 10);
  }, [allStocks]);

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
          <Link href="/" className={colors.textMuted}>取消</Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className={`mt-2 ${colors.textMuted}`}>加载股票数据...</p>
          </div>
        ) : query ? (
          /* 搜索结果 */
          <div>
            <div className={`text-sm ${colors.textMuted} py-2 flex justify-between`}>
              <span>搜索结果 ({results.length})</span>
              <span>共 {stockCount.toLocaleString()} 只股票</span>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-8">
                <p className={colors.textMuted}>未找到相关股票</p>
              </div>
            ) : (
              <div className="space-y-1">
                {results.map(stock => (
                  <Link
                    key={`${stock.market}-${stock.symbol}`}
                    href={`/stock/${stock.market}/${stock.symbol}`}
                    className={`flex items-center justify-between py-3 px-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${stock.market === 'US' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                          {stock.market === 'US' ? '美' : '港'}
                        </span>
                      </div>
                      <div className={`text-sm ${colors.textMuted} truncate max-w-[250px]`}>
                        {stock.alias ? `${stock.alias} · ${stock.name}` : stock.name}
                      </div>
                    </div>
                    <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 默认显示 */
          <div>
            {/* 股票数量提示 */}
            <div className={`text-xs ${colors.textMuted} text-center py-2`}>
              已加载 {stockCount.toLocaleString()} 只股票（美股+港股）
            </div>
            
            {/* 热门搜索 */}
            <div className="py-4">
              <h3 className={`text-sm ${colors.textMuted} mb-3`}>热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className={`px-3 py-1.5 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* 搜索历史 */}
            <div className="py-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-sm ${colors.textMuted}`}>搜索历史</h3>
                <button className={`text-sm ${colors.textMuted}`}>清空</button>
              </div>
              <div className="space-y-2">
                {SEARCH_HISTORY.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className={`flex items-center gap-2 w-full text-left py-2 ${colors.textMuted}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* 热门股票 */}
            <div className="py-4">
              <h3 className={`text-sm ${colors.textMuted} mb-3`}>热门股票</h3>
              <div className="space-y-1">
                {hotStocks.map(stock => (
                  <Link
                    key={`${stock.market}-${stock.symbol}`}
                    href={`/stock/${stock.market}/${stock.symbol}`}
                    className={`flex items-center justify-between py-3 px-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${stock.market === 'US' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                          {stock.market === 'US' ? '美' : '港'}
                        </span>
                      </div>
                      <div className={`text-sm ${colors.textMuted}`}>
                        {stock.alias || stock.name}
                      </div>
                    </div>
                    <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
