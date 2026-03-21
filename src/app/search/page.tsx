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

export default function SearchPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [query, setQuery] = useState('');
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载股票数据
  useEffect(() => {
    fetch('/trading-app/data/stocks.json')
      .then(res => res.json())
      .then(data => {
        setAllStocks(data);
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
          <Link href="/" className="text-blue-500">取消</Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* 加载中 */}
        {loading && (
          <div className={`text-center py-20 ${colors.textMuted}`}>
            <div className="text-4xl mb-4">⏳</div>
            <div>加载股票数据中...</div>
            <div className="text-sm mt-2">共 3,188 只股票</div>
          </div>
        )}

        {/* 有搜索词时显示结果 */}
        {!loading && query.trim() ? (
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
                        {stock.sector && <span className="text-xs">· {stock.sector}</span>}
                      </div>
                    </div>
                    <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 ${colors.textMuted}`}>
                <div className="text-4xl mb-4">🔍</div>
                <div>没有找到 &quot;{query}&quot; 相关的股票</div>
              </div>
            )}
          </div>
        ) : !loading && (
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
                {hotStocks.map(stock => (
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
                    <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* 股票总数 */}
            <div className={`text-center py-4 text-sm ${colors.textMuted}`}>
              共收录 {allStocks.length.toLocaleString()} 只股票
            </div>
          </>
        )}
      </div>
    </main>
  );
}
