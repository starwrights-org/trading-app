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

// 静态迷你走势图（无需 hooks）
function MiniChartStatic({ isUp, seed }: { isUp: boolean; seed: number }) {
  const points = [];
  let val = 100;
  for (let i = 0; i < 20; i++) {
    val += ((((seed + i) * 9301 + 49297) % 233280) / 233280 - 0.5) * 5;
    const x = (i / 19) * 50;
    const y = 18 - ((val - 95) / 10) * 14;
    points.push(`${x.toFixed(1)},${Math.max(2, Math.min(18, y)).toFixed(1)}`);
  }

  return (
    <svg width="50" height="20" className="flex-shrink-0">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={isUp ? '#10b981' : '#ef4444'}
        strokeWidth="1.2"
      />
    </svg>
  );
}

// 默认自选股（用户未添加收藏时显示）
const DEFAULT_WATCHLIST = [
  { symbol: 'NVDA', name: '英伟达', market: 'US' as const, price: 172.70, changePercent: -3.28, prevClose: 174.87 },
  { symbol: 'BABA', name: '阿里巴巴', market: 'US' as const, price: 122.41, changePercent: -1.99, prevClose: 123.55 },
  { symbol: 'SPY', name: '标普 500 ETF - SPDR', market: 'US' as const, price: 648.57, changePercent: -1.43, prevClose: 653.40 },
  { symbol: '00700', name: '腾讯控股', market: 'HK' as const, price: 508.00, changePercent: -0.59, prevClose: 511.00 },
  { symbol: '09988', name: '阿里巴巴-SW', market: 'HK' as const, price: 123.70, changePercent: -1.43, prevClose: 125.50 },
  { symbol: '00005', name: '汇丰控股', market: 'HK' as const, price: 124.50, changePercent: 0.40, prevClose: 124.00 },
];

export default function WatchlistPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'all' | 'us' | 'hk'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allStocks, setAllStocks] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏列表和股票数据
  useEffect(() => {
    const favList = getFavorites();
    setFavorites(favList);
    
    // 加载完整股票数据
    fetch('/trading-app/data/stocks.json?v=20260322')
      .then(res => res.json())
      .then((data: StockInfo[]) => {
        setAllStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 根据收藏列表获取自选股
  const watchlist = useMemo(() => {
    let list: StockInfo[] = [];
    
    if (favorites.length === 0) {
      // 没有收藏，显示默认推荐
      list = DEFAULT_WATCHLIST;
    } else {
      // 从完整股票库中获取收藏的股票
      list = favorites.map(symbol => {
        const found = allStocks.find(s => s.symbol === symbol);
        if (found) {
          return {
            ...found,
            prevClose: found.price ? found.price * (1 - (found.changePercent || 0) / 100) : undefined,
          };
        }
        // 找不到则创建占位
        return {
          symbol,
          name: symbol,
          market: symbol.match(/^\d/) ? 'HK' as const : 'US' as const,
          price: undefined,
          changePercent: undefined,
          prevClose: undefined,
        };
      });
    }

    // 按 Tab 筛选
    if (activeTab === 'us') {
      list = list.filter(s => s.market === 'US');
    } else if (activeTab === 'hk') {
      list = list.filter(s => s.market === 'HK');
    }

    // 排序
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'price') cmp = (a.price || 0) - (b.price || 0);
      else cmp = (a.changePercent || 0) - (b.changePercent || 0);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [favorites, allStocks, activeTab, sortBy, sortDir]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  // 统计各市场数量
  const usCount = favorites.length > 0 
    ? favorites.filter(s => !s.match(/^\d/)).length 
    : DEFAULT_WATCHLIST.filter(s => s.market === 'US').length;
  const hkCount = favorites.length > 0 
    ? favorites.filter(s => s.match(/^\d/)).length 
    : DEFAULT_WATCHLIST.filter(s => s.market === 'HK').length;
  const allCount = usCount + hkCount;

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">自选</h1>
          <div className="flex items-center gap-4">
            <Link href="/search" className={colors.textSecondary}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/favorites" className="text-red-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </Link>
            <button className={colors.textSecondary}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab 切换：全部 / 美股 / 港股 */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'all'
                  ? 'bg-gray-800 text-white'
                  : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              全部 ({allCount})
            </button>
            <button
              onClick={() => setActiveTab('us')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'us'
                  ? 'bg-gray-800 text-white'
                  : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              美股 ({usCount})
            </button>
            <button
              onClick={() => setActiveTab('hk')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'hk'
                  ? 'bg-gray-800 text-white'
                  : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              港股 ({hkCount})
            </button>
            <div className="flex-1" />
            <Link href="/favorites" className="text-red-500 text-sm">
              ❤️ 管理
            </Link>
          </div>
        </div>

        {/* 工具栏 */}
        <div className={`px-4 py-2 flex items-center gap-4 border-b ${colors.border}`}>
          <button className={colors.textMuted}>⚙️</button>
          <button className={colors.textMuted}>📋</button>
          <span className={`${colors.borderLight} border-l h-4`} />
          <button className={colors.textMuted}>≡</button>
        </div>

        {/* 表头 */}
        <div className={`grid grid-cols-12 gap-2 px-4 py-2 text-xs ${colors.textMuted} border-b ${colors.border}`}>
          <button 
            onClick={() => toggleSort('name')}
            className="col-span-5 text-left flex items-center gap-1"
          >
            名称/代码 {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => toggleSort('price')}
            className="col-span-3 text-right flex items-center justify-end gap-1"
          >
            最新价 {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => toggleSort('change')}
            className="col-span-4 text-right flex items-center justify-end gap-1"
          >
            涨跌幅 {sortBy === 'change' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* 股票列表 */}
        {!loading && watchlist.map((stock, idx) => {
          const isUp = (stock.changePercent || 0) >= 0;
          const price = stock.price || 0;
          const prevClose = stock.prevClose || price;
          const changePercent = stock.changePercent || 0;
          
          return (
            <Link
              key={`${stock.market}-${stock.symbol}`}
              href={`/stock/${stock.market}/${stock.symbol}/`}
              className={`grid grid-cols-12 gap-2 px-4 py-3 border-b ${colors.borderLight} ${colors.hover} transition items-center`}
            >
              {/* 名称/代码 */}
              <div className="col-span-5">
                <div className={`font-medium ${colors.text} truncate`}>{stock.name}</div>
                <div className={`text-xs ${colors.textMuted} flex items-center gap-1`}>
                  <span className={stock.market === 'US' ? 'text-blue-500' : 'text-red-500'}>{stock.market}</span>
                  <span>{stock.symbol}</span>
                  {favorites.includes(stock.symbol) && <span className="text-red-500">❤️</span>}
                </div>
              </div>

              {/* 迷你走势图 */}
              <div className="col-span-1 flex justify-center">
                <MiniChartStatic isUp={isUp} seed={idx + stock.symbol.charCodeAt(0)} />
              </div>

              {/* 最新价 / 前收 */}
              <div className="col-span-2 text-right">
                <div className={`font-medium ${colors.text}`}>
                  {price > 0 ? price.toFixed(stock.market === 'HK' ? 3 : 2) : '--'}
                </div>
                <div className={`text-xs ${colors.textMuted}`}>
                  {prevClose > 0 ? prevClose.toFixed(stock.market === 'HK' ? 3 : 2) : '--'}
                </div>
              </div>

              {/* 涨跌幅 */}
              <div className="col-span-4 text-right">
                <div className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                  isUp ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {changePercent !== 0 ? `${isUp ? '+' : ''}${changePercent.toFixed(2)}%` : '--'}
                </div>
                {stock.market === 'US' && (
                  <div className={`text-xs ${colors.textMuted} mt-1`}>
                    <span className="text-cyan-500">盘后</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {/* 空状态 */}
        {!loading && watchlist.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📈</div>
            <div className={`text-lg ${colors.textMuted}`}>
              {activeTab === 'us' ? '暂无美股自选' : activeTab === 'hk' ? '暂无港股自选' : '暂无自选股票'}
            </div>
            <Link href="/search" className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg">
              去发现股票
            </Link>
          </div>
        )}

        {/* 底部提示 */}
        {!loading && watchlist.length > 0 && (
          <div className={`mx-4 mt-4 p-3 rounded-xl ${colors.bgCard} border ${colors.border}`}>
            <div className="flex items-center gap-2">
              <span className="text-red-500">❤️</span>
              <span className={`text-sm ${colors.textMuted}`}>
                {favorites.length > 0 
                  ? `已收藏 ${favorites.length} 只股票，在详情页点击 ❤️ 管理收藏`
                  : '点击股票详情页右上角 ❤️ 添加自选'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </main>
  );
}
