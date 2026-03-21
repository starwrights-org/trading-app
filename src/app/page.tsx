'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { MOCK_STOCKS, MOCK_POSITIONS, MOCK_ACCOUNT } from '@/lib/mockData';
import { Stock } from '@/lib/types';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 迷你走势图组件
function MiniChart({ trend, isUp }: { trend: number[]; isUp: boolean }) {
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  
  const points = trend.map((val, i) => {
    const x = (i / (trend.length - 1)) * 50;
    const y = 18 - ((val - min) / range) * 14;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="50" height="20" className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? '#10b981' : '#ef4444'}
        strokeWidth="1.2"
      />
    </svg>
  );
}

// 生成模拟走势数据
function generateTrend(): number[] {
  const trend: number[] = [];
  let val = 100;
  for (let i = 0; i < 20; i++) {
    val += (Math.random() - 0.5) * 5;
    trend.push(val);
  }
  return trend;
}

// 股票行组件
function StockRow({ stock, showMarket = false, showAfterHours = false, colors }: { 
  stock: Stock; 
  showMarket?: boolean; 
  showAfterHours?: boolean;
  colors: typeof themeColors.dark;
}) {
  const isUp = stock.change >= 0;
  const trend = useMemo(() => generateTrend(), []);
  const afterHoursChange = (Math.random() - 0.3) * 2;
  const afterHoursUp = afterHoursChange >= 0;
  
  return (
    <Link href={`/stock/${stock.market}/${stock.symbol}`} className={`flex items-center justify-between py-3 px-4 ${colors.hover} transition`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${colors.text}`}>{stock.name}</span>
          {showMarket && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${stock.market === 'HK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {stock.market}
            </span>
          )}
        </div>
        <div className={`text-sm ${colors.textMuted}`}>{stock.symbol}</div>
      </div>

      <div className="mx-2">
        <MiniChart trend={trend} isUp={isUp} />
      </div>

      <div className="text-right flex items-center gap-2">
        <div>
          <div className={`font-medium ${colors.text}`}>{stock.price.toFixed(2)}</div>
          <div className={`text-xs ${colors.textMuted}`}>{stock.prevClose?.toFixed(2) || '-'}</div>
        </div>
        
        <div className="flex flex-col items-end gap-0.5 min-w-[60px]">
          <span className={`px-2 py-0.5 rounded text-sm font-medium ${
            isUp ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}>
            {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
          
          {showAfterHours && (
            <div className="flex items-center gap-1 text-xs">
              <span className={afterHoursUp ? 'text-green-400' : 'text-red-400'}>
                {afterHoursUp ? '+' : ''}{afterHoursChange.toFixed(2)}%
              </span>
              <span className={`${colors.textMuted} text-[10px]`}>盘后</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'watchlist' | 'hk' | 'us'>('watchlist');
  const [activeFilter, setActiveFilter] = useState<'all' | 'positions'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price' | 'change'>('default');
  const [sortAsc, setSortAsc] = useState(false);

  const watchlist = MOCK_STOCKS.slice(0, 8);
  const hkStocks = MOCK_STOCKS.filter(s => s.market === 'HK');
  const usStocks = MOCK_STOCKS.filter(s => s.market === 'US');

  const filteredStocks = useMemo(() => {
    let stocks = activeTab === 'watchlist' ? watchlist : activeTab === 'hk' ? hkStocks : usStocks;
    
    if (activeFilter === 'positions') {
      const positionSymbols = MOCK_POSITIONS.map(p => p.symbol);
      stocks = stocks.filter(s => positionSymbols.includes(s.symbol));
    }

    if (sortBy !== 'default') {
      stocks = [...stocks].sort((a, b) => {
        const val = sortBy === 'price' ? a.price - b.price : a.changePercent - b.changePercent;
        return sortAsc ? val : -val;
      });
    }

    return stocks;
  }, [activeTab, activeFilter, sortBy, sortAsc]);

  const handleSort = (field: 'price' | 'change') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">交易</h1>
          <div className="flex items-center gap-3">
            <button className={`${colors.textSecondary} hover:${colors.text}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className={`${colors.textSecondary} hover:${colors.text}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 账户概览 */}
        <div className={`p-4 bg-gradient-to-r ${colors.cardGradient} m-4 rounded-xl`}>
          <div className={`text-sm ${colors.textSecondary} mb-1`}>总资产 (HKD)</div>
          <div className="text-3xl font-bold mb-2">{MOCK_ACCOUNT.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className={colors.textSecondary}>今日盈亏</span>
              <span className={`ml-2 ${MOCK_ACCOUNT.todayProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {MOCK_ACCOUNT.todayProfitLoss >= 0 ? '+' : ''}{MOCK_ACCOUNT.todayProfitLoss.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={colors.textSecondary}>可用资金</span>
              <span className={`ml-2 ${colors.text}`}>{MOCK_ACCOUNT.cashBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-4 gap-2 px-4 mb-4">
          {[
            { icon: '📈', label: '行情', href: '/market' },
            { icon: '💼', label: '持仓', href: '/positions' },
            { icon: '📋', label: '订单', href: '/orders' },
            { icon: '💰', label: '资金', href: '/account' },
          ].map(item => (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center py-3 ${colors.bgCard} rounded-xl ${colors.hover} transition`}>
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className={`text-xs ${colors.textSecondary}`}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Tab 切换 */}
        <div className={`flex items-center border-b ${colors.border} px-4`}>
          <div className="flex flex-1">
            {[
              { key: 'watchlist', label: '自选' },
              { key: 'hk', label: '港股' },
              { key: 'us', label: '美股' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-500'
                    : `border-transparent ${colors.textSecondary} hover:${colors.text}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'positions', label: '持仓' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                className={`px-3 py-1 rounded-full text-xs transition ${
                  activeFilter === filter.key
                    ? `${colors.bgSecondary} ${colors.text}`
                    : `${colors.textMuted} hover:${colors.text}`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排序栏 */}
        <div className={`flex items-center justify-end px-4 py-2 text-xs ${colors.textMuted} gap-4 border-b ${colors.borderLight}`}>
          <button 
            onClick={() => handleSort('price')}
            className={`flex items-center gap-1 ${sortBy === 'price' ? 'text-blue-500' : ''}`}
          >
            最新价 {sortBy === 'price' && (sortAsc ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('change')}
            className={`flex items-center gap-1 ${sortBy === 'change' ? 'text-blue-500' : ''}`}
          >
            涨跌幅 {sortBy === 'change' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>

        {/* 股票列表 */}
        <div className={`divide-y ${colors.borderLight}`}>
          {filteredStocks.map(stock => (
            <StockRow 
              key={stock.symbol} 
              stock={stock} 
              showMarket={activeTab === 'watchlist'} 
              showAfterHours={stock.market === 'US'}
              colors={colors}
            />
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className={`text-center py-20 ${colors.textMuted}`}>
            <div className="text-4xl mb-4">📭</div>
            <div>暂无股票</div>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </main>
  );
}
