'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { MOCK_STOCKS } from '@/lib/mockData';
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

// 静态迷你走势图（无需 hooks）
function MiniChartStatic({ isUp, seed }: { isUp: boolean; seed: number }) {
  // 基于 seed 生成固定的随机走势
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

// 自选股数据（扩展）
const WATCHLIST_US = [
  { name: '投资组合标普 500 指...', symbol: 'SPYM', market: 'US', price: 76.330, prevClose: 76.920, change: -0.59, changePercent: -1.43, afterHoursChange: 0.77 },
  { name: '纳斯达克 100 指数 ETF...', symbol: 'QQQM', market: 'US', price: 239.640, prevClose: 241.721, change: -2.08, changePercent: -1.87, afterHoursChange: 0.87 },
  { name: '标普 500 ETF - SPDR', symbol: 'SPY', market: 'US', price: 648.570, prevClose: 653.400, change: -4.83, changePercent: -1.43, afterHoursChange: 0.74 },
  { name: '美债市场指数 ETF - Va...', symbol: 'BND', market: 'US', price: 73.170, prevClose: 73.160, change: 0.01, changePercent: -0.80, afterHoursChange: -0.01 },
  { name: '纳斯达克综合指数 ETF...', symbol: 'ONEQ', market: 'US', price: 85.160, prevClose: 86.080, change: -0.92, changePercent: -1.99, afterHoursChange: 1.08 },
  { name: '纳指 100 ETF - Invesco', symbol: 'QQQ', market: 'US', price: 582.060, prevClose: 587.120, change: -5.06, changePercent: -1.85, afterHoursChange: 0.87 },
  { name: '英伟达', symbol: 'NVDA', market: 'US', price: 172.700, prevClose: 174.870, change: -2.17, changePercent: -3.28, afterHoursChange: 1.26 },
  { name: '阿里巴巴', symbol: 'BABA', market: 'US', price: 122.410, prevClose: 123.550, change: -1.14, changePercent: -1.99, afterHoursChange: 0.93 },
];

const WATCHLIST_HK = [
  { name: '腾讯控股', symbol: '00700', market: 'HK', price: 508.000, prevClose: 511.000, change: -3.00, changePercent: -0.59, afterHoursChange: 0 },
  { name: '阿里巴巴-SW', symbol: '09988', market: 'HK', price: 123.700, prevClose: 125.500, change: -1.80, changePercent: -1.43, afterHoursChange: 0 },
  { name: '美团-W', symbol: '03690', market: 'HK', price: 79.150, prevClose: 81.500, change: -2.35, changePercent: -2.88, afterHoursChange: 0 },
  { name: '小米集团-W', symbol: '01810', market: 'HK', price: 33.200, prevClose: 34.000, change: -0.80, changePercent: -2.35, afterHoursChange: 0 },
  { name: '香港交易所', symbol: '00388', market: 'HK', price: 396.000, prevClose: 390.000, change: 6.00, changePercent: 1.54, afterHoursChange: 0 },
  { name: '中国平安', symbol: '02318', market: 'HK', price: 41.850, prevClose: 42.500, change: -0.65, changePercent: -1.53, afterHoursChange: 0 },
];

export default function WatchlistPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'all' | 'us' | 'hk'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // 根据 Tab 筛选数据
  const watchlist = useMemo(() => {
    let list: typeof WATCHLIST_US = [];
    if (activeTab === 'all') {
      list = [...WATCHLIST_US, ...WATCHLIST_HK];
    } else if (activeTab === 'us') {
      list = WATCHLIST_US;
    } else {
      list = WATCHLIST_HK;
    }

    // 排序
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'price') cmp = a.price - b.price;
      else cmp = a.changePercent - b.changePercent;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [activeTab, sortBy, sortDir]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">自选</h1>
          <div className="flex items-center gap-4">
            <button className={colors.textSecondary}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
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
              全部
            </button>
            <button
              onClick={() => setActiveTab('us')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'us'
                  ? 'bg-gray-800 text-white'
                  : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              美股
            </button>
            <button
              onClick={() => setActiveTab('hk')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'hk'
                  ? 'bg-gray-800 text-white'
                  : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              港股
            </button>
            <div className="flex-1" />
            <span className={colors.textMuted}>∨</span>
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
        {/* 股票列表 */}
        {watchlist.map((stock, idx) => {
          const isUp = stock.changePercent >= 0;
          
          return (
            <Link
              key={`${stock.market}-${stock.symbol}`}
              href={`/stock/${stock.market}/${stock.symbol}`}
              className={`grid grid-cols-12 gap-2 px-4 py-3 border-b ${colors.borderLight} ${colors.hover} transition items-center`}
            >
              {/* 名称/代码 */}
              <div className="col-span-5">
                <div className={`font-medium ${colors.text} truncate`}>{stock.name}</div>
                <div className={`text-xs ${colors.textMuted} flex items-center gap-1`}>
                  <span className="text-blue-500">{stock.market}</span>
                  <span>{stock.symbol}</span>
                  <span className="text-yellow-500">🏆</span>
                </div>
              </div>

              {/* 迷你走势图 */}
              <div className="col-span-1 flex justify-center">
                <MiniChartStatic isUp={isUp} seed={idx} />
              </div>

              {/* 最新价 / 前收 */}
              <div className="col-span-2 text-right">
                <div className={`font-medium ${colors.text}`}>{stock.price.toFixed(3)}</div>
                <div className={`text-xs ${colors.textMuted}`}>{stock.prevClose.toFixed(3)}</div>
              </div>

              {/* 涨跌幅 / 盘后 */}
              <div className="col-span-4 text-right">
                <div className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                  isUp ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
                {stock.market === 'US' && (
                  <div className={`text-xs ${colors.textMuted} mt-1`}>
                    {stock.afterHoursChange >= 0 ? '+' : ''}{stock.afterHoursChange.toFixed(2)}% <span className="text-cyan-500">盘后</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {/* 底部新闻提示 */}
        <div className={`mx-4 mt-4 p-3 rounded-xl ${colors.bgCard} border ${colors.border}`}>
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-sm">N</span>
            <span className={`text-sm ${colors.text}`}>小鹏（4Q25 纪要）：IRON 机器人目标到 2026 年底...</span>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </main>
  );
}
