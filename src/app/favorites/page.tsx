'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 收藏工具函数
const FAVORITES_KEY = 'trading_app_favorites';

interface StockInfo {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  price?: number;
  change?: number;
  changePercent?: number;
}

export default function FavoritesPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏列表
  useEffect(() => {
    const data = localStorage.getItem(FAVORITES_KEY);
    const favList = data ? JSON.parse(data) : [];
    setFavorites(favList);
    
    // 加载股票数据
    fetch('/trading-app/data/stocks.json?v=20260322')
      .then(res => res.json())
      .then((allStocks: StockInfo[]) => {
        const favStocks = favList.map((symbol: string) => {
          const found = allStocks.find(s => s.symbol === symbol);
          return found || { symbol, name: symbol, market: symbol.match(/^\d/) ? 'HK' : 'US' };
        });
        setStocks(favStocks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 移除收藏
  const handleRemove = (symbol: string) => {
    const newFavorites = favorites.filter(s => s !== symbol);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setStocks(stocks.filter(s => s.symbol !== symbol));
  };

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10 border-b ${colors.border}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/account" className={`mr-4 ${colors.textSecondary}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center font-bold">我的收藏</div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💔</div>
            <div className={`text-lg ${colors.textMuted}`}>暂无收藏</div>
            <div className={`text-sm ${colors.textMuted} mt-2`}>点击股票详情页右上角的 ❤️ 添加收藏</div>
            <Link href="/search" className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg">
              去发现股票
            </Link>
          </div>
        ) : (
          <div className={`${colors.bgCard} rounded-xl divide-y ${colors.border}`}>
            {stocks.map((stock) => (
              <div key={stock.symbol} className={`flex items-center px-4 py-3 ${colors.hover}`}>
                <Link href={`/stock/${stock.market}/${stock.symbol}/`} className="flex-1 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${stock.market === 'HK' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {stock.market === 'HK' ? '港股' : '美股'}
                      </span>
                    </div>
                    <div className={`text-sm ${colors.textMuted}`}>{stock.name}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-medium">
                      {stock.price ? stock.price.toFixed(stock.market === 'HK' ? 3 : 2) : '--'}
                    </div>
                    {stock.changePercent !== undefined && (
                      <div className={`text-sm ${stock.changePercent >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </Link>
                <button 
                  onClick={() => handleRemove(stock.symbol)}
                  className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                  title="取消收藏"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* 提示 */}
        {favorites.length > 0 && (
          <div className={`text-center text-sm ${colors.textMuted} mt-4`}>
            共 {favorites.length} 只收藏 | 点击 ❤️ 取消收藏
          </div>
        )}
      </div>

      <BottomNav active="account" />
    </main>
  );
}
