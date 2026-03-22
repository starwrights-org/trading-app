'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 收藏工具函数
const FAVORITES_KEY = 'trading_app_favorites';

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// 股票信息类型
interface StockInfo {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  price?: number;
  change?: number;
  changePercent?: number;
  prevClose?: number;
}

// 迷你走势图 - 更精致的版本
function MiniChart({ isUp, seed }: { isUp: boolean; seed: number }) {
  const points = [];
  let val = 100;
  for (let i = 0; i < 24; i++) {
    val += ((((seed + i) * 9301 + 49297) % 233280) / 233280 - 0.5) * 4;
    const x = (i / 23) * 56;
    const y = 16 - ((val - 96) / 8) * 12;
    points.push(`${x.toFixed(1)},${Math.max(2, Math.min(14, y)).toFixed(1)}`);
  }

  const color = isUp ? '#22c55e' : '#ef4444';
  
  return (
    <svg width="56" height="16" className="flex-shrink-0">
      <defs>
        <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0,16 L ${points.map(p => p).join(' L ')} L 56,16 Z`}
        fill={`url(#grad-${seed})`}
      />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 默认自选股
const DEFAULT_WATCHLIST = [
  { symbol: 'NVDA', name: '英伟达', market: 'US' as const, price: 172.70, changePercent: -3.28, prevClose: 174.87 },
  { symbol: 'AAPL', name: '苹果', market: 'US' as const, price: 247.99, changePercent: 1.23, prevClose: 244.97 },
  { symbol: 'TSLA', name: '特斯拉', market: 'US' as const, price: 367.96, changePercent: -2.15, prevClose: 376.05 },
  { symbol: '00700', name: '腾讯控股', market: 'HK' as const, price: 508.00, changePercent: -0.59, prevClose: 511.00 },
  { symbol: '09988', name: '阿里巴巴-SW', market: 'HK' as const, price: 123.70, changePercent: 2.43, prevClose: 120.77 },
  { symbol: '00005', name: '汇丰控股', market: 'HK' as const, price: 124.50, changePercent: 0.40, prevClose: 124.00 },
];

export default function WatchlistPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'all' | 'us' | 'hk'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allStocks, setAllStocks] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favList = getFavorites();
    setFavorites(favList);
    
    fetch('/trading-app/data/stocks.json?v=20260322')
      .then(res => res.json())
      .then((data: StockInfo[]) => {
        setAllStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const watchlist = useMemo(() => {
    let list: StockInfo[] = favorites.length === 0 
      ? DEFAULT_WATCHLIST 
      : favorites.map(symbol => {
          const found = allStocks.find(s => s.symbol === symbol);
          return found || { symbol, name: symbol, market: symbol.match(/^\d/) ? 'HK' as const : 'US' as const };
        });

    if (activeTab === 'us') list = list.filter(s => s.market === 'US');
    else if (activeTab === 'hk') list = list.filter(s => s.market === 'HK');
    
    return list;
  }, [favorites, allStocks, activeTab]);

  const counts = {
    all: favorites.length || DEFAULT_WATCHLIST.length,
    us: (favorites.length ? favorites.filter(s => !s.match(/^\d/)) : DEFAULT_WATCHLIST.filter(s => s.market === 'US')).length,
    hk: (favorites.length ? favorites.filter(s => s.match(/^\d/)) : DEFAULT_WATCHLIST.filter(s => s.market === 'HK')).length,
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} ${colors.text} pb-20`}>
      {/* Header - 简洁现代 */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">自选</h1>
            <div className="flex items-center gap-3">
              <Link href="/search" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}>
                <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/favorites" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}>
                <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab 切换 - 胶囊式设计 */}
        <div className="max-w-lg mx-auto px-5 pb-4">
          <div className={`inline-flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
            {(['all', 'us', 'hk'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? '全部' : tab === 'us' ? '美股' : '港股'}
                <span className={`ml-1.5 ${activeTab === tab ? 'opacity-60' : 'opacity-40'}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5">
        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        {/* 股票列表 - 卡片式设计 */}
        {!loading && (
          <div className="space-y-3">
            {watchlist.map((stock, idx) => {
              const isUp = (stock.changePercent || 0) >= 0;
              const price = stock.price || 0;
              const changePercent = stock.changePercent || 0;
              
              return (
                <Link
                  key={`${stock.market}-${stock.symbol}`}
                  href={`/stock/${stock.market}/${stock.symbol}/`}
                  className={`block p-4 rounded-2xl transition-all duration-200 ${
                    isDark 
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]' 
                      : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* 左侧：股票信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${colors.text}`}>{stock.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          stock.market === 'US' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {stock.market}
                        </span>
                      </div>
                      <div className={`text-sm mt-0.5 opacity-50`}>{stock.symbol}</div>
                    </div>

                    {/* 中间：走势图 */}
                    <div className="mx-4">
                      <MiniChart isUp={isUp} seed={idx + stock.symbol.charCodeAt(0)} />
                    </div>

                    {/* 右侧：价格和涨跌幅 */}
                    <div className="text-right">
                      <div className={`font-semibold tabular-nums ${colors.text}`}>
                        {price > 0 ? price.toFixed(stock.market === 'HK' ? 2 : 2) : '--'}
                      </div>
                      <div className={`text-sm font-medium tabular-nums ${
                        isUp ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {changePercent !== 0 ? `${isUp ? '+' : ''}${changePercent.toFixed(2)}%` : '--'}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 空状态 */}
        {!loading && watchlist.length === 0 && (
          <div className="text-center py-20">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
              <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div className={`text-lg font-medium ${colors.text}`}>暂无自选股票</div>
            <div className="text-sm opacity-50 mt-1">点击股票详情页的 ❤️ 添加自选</div>
            <Link 
              href="/search" 
              className={`inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-medium transition ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              发现股票
            </Link>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </main>
  );
}
