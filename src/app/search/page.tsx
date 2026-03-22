'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/theme';

interface Stock {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  sector?: string;
  alias?: string;
}

const HOT_SEARCHES = ['NVDA', '腾讯', 'TSLA', '阿里巴巴', 'SPY', '小米', 'AAPL', '美团'];
const DATA_VERSION = '20260321v4';
const HISTORY_KEY = 'trading_search_history';

export default function SearchPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [query, setQuery] = useState('');
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveHistory = useCallback((history: string[]) => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
  }, []);

  const addToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      const newHistory = [term, ...filtered].slice(0, 10);
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    saveHistory([]);
  }, [saveHistory]);

  useEffect(() => {
    fetch(`/trading-app/data/stocks.json?v=${DATA_VERSION}`)
      .then(res => res.json())
      .then(data => { setAllStocks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query.trim() || allStocks.length === 0) return [];
    const q = query.toLowerCase();
    return allStocks.filter(stock => 
      stock.name.toLowerCase().includes(q) ||
      stock.symbol.toLowerCase().includes(q) ||
      (stock.alias && stock.alias.toLowerCase().includes(q))
    ).slice(0, 50);
  }, [query, allStocks]);

  const hotStocks = useMemo(() => allStocks.slice(0, 8), [allStocks]);

  const handleStockClick = (stock: Stock) => addToHistory(stock.symbol);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-black'}`}>
      {/* 搜索栏 */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} sticky top-0 z-10 px-5 py-4`}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className={`flex-1 flex items-center ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-xl px-4 py-3`}>
            <svg className="w-5 h-5 opacity-40 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索股票代码、名称"
              autoFocus
              className={`flex-1 bg-transparent outline-none ${isDark ? 'placeholder-white/30' : 'placeholder-black/30'}`}
            />
            {query && (
              <button onClick={() => setQuery('')} className="opacity-40 hover:opacity-60">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <Link href="/" className={`font-medium ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}>
            取消
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5">
        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-sm opacity-50">加载股票数据...</p>
          </div>
        ) : query ? (
          /* 搜索结果 */
          <div>
            <div className="text-sm opacity-50 py-3">
              找到 {results.length} 个结果
            </div>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
                  <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="opacity-50">未找到相关股票</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map(stock => (
                  <Link
                    key={`${stock.market}-${stock.symbol}`}
                    href={`/stock/${stock.market}/${stock.symbol}`}
                    onClick={() => handleStockClick(stock)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      isDark 
                        ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]' 
                        : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          stock.market === 'US' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {stock.market}
                        </span>
                      </div>
                      <div className="text-sm opacity-50 mt-0.5 truncate max-w-[250px]">
                        {stock.alias ? `${stock.alias} · ${stock.name}` : stock.name}
                      </div>
                    </div>
                    <svg className="w-5 h-5 opacity-30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 默认显示 */
          <div className="space-y-8">
            {/* 热门搜索 */}
            <section>
              <h3 className="text-sm font-medium opacity-50 mb-3">热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium opacity-50">搜索历史</h3>
                  <button onClick={clearHistory} className="text-sm text-orange-500 hover:text-orange-400">
                    清空
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((term, index) => (
                    <button
                      key={`${term}-${index}`}
                      onClick={() => setQuery(term)}
                      className={`flex items-center gap-3 w-full text-left py-3 px-2 rounded-xl transition ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                      }`}
                    >
                      <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="opacity-70">{term}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* 热门股票 */}
            <section>
              <h3 className="text-sm font-medium opacity-50 mb-3">热门股票</h3>
              <div className="grid grid-cols-2 gap-3">
                {hotStocks.map(stock => (
                  <Link
                    key={`${stock.market}-${stock.symbol}`}
                    href={`/stock/${stock.market}/${stock.symbol}`}
                    onClick={() => handleStockClick(stock)}
                    className={`p-4 rounded-2xl transition-all ${
                      isDark 
                        ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]' 
                        : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{stock.symbol}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        stock.market === 'US' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {stock.market}
                      </span>
                    </div>
                    <div className="text-sm opacity-50 truncate">
                      {stock.alias || stock.name}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
