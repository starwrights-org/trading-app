'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { MOCK_STOCKS, MOCK_POSITIONS, MOCK_ACCOUNT } from '@/lib/mockData';
import { Stock } from '@/lib/types';

// 迷你走势图组件
function MiniChart({ trend, isUp }: { trend: number[]; isUp: boolean }) {
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  
  const points = trend.map((val, i) => {
    const x = (i / (trend.length - 1)) * 60;
    const y = 20 - ((val - min) / range) * 18;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? '#00b894' : '#e74c3c'}
        strokeWidth="1.5"
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

// 股票行组件 - 长桥风格
function StockRow({ stock, showAfterHours = true }: { stock: Stock; showAfterHours?: boolean }) {
  const isUp = stock.change >= 0;
  const trend = useMemo(() => generateTrend(), []);
  const afterHoursChange = (Math.random() - 0.3) * 2; // 模拟盘后涨跌
  const afterHoursUp = afterHoursChange >= 0;
  
  return (
    <Link 
      href={`/stock/${stock.market}/${stock.symbol}`} 
      className="flex items-center py-4 px-4 hover:bg-gray-800/30 transition border-b border-gray-800/30"
    >
      {/* 左侧：名称和代码 */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white text-base">{stock.name}</div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <span className={`text-xs ${stock.market === 'US' ? 'text-blue-400' : 'text-red-400'}`}>
            {stock.market}
          </span>
          <span>{stock.symbol}</span>
        </div>
      </div>

      {/* 中间：迷你走势图 */}
      <div className="mx-3">
        <MiniChart trend={trend} isUp={isUp} />
      </div>

      {/* 右侧：价格和涨跌幅 */}
      <div className="text-right flex items-center gap-3">
        <div>
          <div className="font-medium text-white text-base">{stock.price.toFixed(3)}</div>
          <div className="text-xs text-gray-500">{stock.prevClose?.toFixed(3) || '-'}</div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          {/* 涨跌幅标签 */}
          <span className={`px-2 py-1 rounded text-sm font-medium min-w-[70px] text-center ${
            isUp ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {isUp ? '' : ''}{stock.changePercent.toFixed(2)}%
          </span>
          
          {/* 盘后数据 */}
          {showAfterHours && (
            <div className="flex items-center gap-1 text-xs">
              <span className={afterHoursUp ? 'text-red-400' : 'text-green-400'}>
                {afterHoursUp ? '+' : ''}{afterHoursChange.toFixed(2)}%
              </span>
              <span className="text-gray-500 bg-gray-800 px-1 rounded text-[10px]">盘后</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [activeMainTab, setActiveMainTab] = useState<'watchlist' | 'orders'>('watchlist');
  const [activeFilter, setActiveFilter] = useState<'all' | 'positions' | 'us' | 'hk'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'change'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  // 根据筛选器过滤股票
  const filteredStocks = useMemo(() => {
    let stocks = [...MOCK_STOCKS];
    
    if (activeFilter === 'positions') {
      const positionSymbols = MOCK_POSITIONS.map(p => p.symbol);
      stocks = stocks.filter(s => positionSymbols.includes(s.symbol));
    } else if (activeFilter === 'us') {
      stocks = stocks.filter(s => s.market === 'US');
    } else if (activeFilter === 'hk') {
      stocks = stocks.filter(s => s.market === 'HK');
    }

    // 排序
    stocks.sort((a, b) => {
      const val = sortBy === 'price' 
        ? a.price - b.price 
        : a.changePercent - b.changePercent;
      return sortAsc ? val : -val;
    });

    return stocks;
  }, [activeFilter, sortBy, sortAsc]);

  const handleSort = (field: 'price' | 'change') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-white pb-20">
      {/* 顶部状态栏模拟 */}
      <div className="bg-[#0d1117] px-4 py-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-gray-400">97%</span>
        </div>
      </div>

      {/* 主 Tab：自选 / 股单 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveMainTab('watchlist')}
            className={`text-lg font-bold ${activeMainTab === 'watchlist' ? 'text-white' : 'text-gray-500'}`}
          >
            自选
          </button>
          <button
            onClick={() => setActiveMainTab('orders')}
            className={`text-lg font-bold ${activeMainTab === 'orders' ? 'text-white' : 'text-gray-500'}`}
          >
            股单
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      {/* 筛选 Tab：全部 / 持仓 / 美股 / 港股 */}
      <div className="flex items-center px-4 py-2 gap-2 border-b border-gray-800/50 overflow-x-auto">
        {[
          { key: 'all', label: '全部' },
          { key: 'positions', label: '持仓' },
          { key: 'us', label: '美股' },
          { key: 'hk', label: '港股' },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              activeFilter === filter.key
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 text-sm border-b border-gray-800/50">
        <div className="flex items-center gap-3 text-gray-500">
          <button className="hover:text-white">⚙️</button>
          <button className="hover:text-white">📋</button>
          <button className="hover:text-white">≡</button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-500 text-xs">恢复默认</span>
          <button 
            onClick={() => handleSort('price')}
            className={`flex items-center gap-1 ${sortBy === 'price' ? 'text-white' : 'text-gray-500'}`}
          >
            最新价
            <span className="text-xs">{sortBy === 'price' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </button>
          <button 
            onClick={() => handleSort('change')}
            className={`flex items-center gap-1 ${sortBy === 'change' ? 'text-white' : 'text-gray-500'}`}
          >
            涨跌幅
            <span className="text-xs">{sortBy === 'change' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </button>
          <button className="text-gray-500">📌</button>
        </div>
      </div>

      {/* 股票列表 */}
      <div className="divide-y divide-gray-800/30">
        {filteredStocks.map(stock => (
          <StockRow 
            key={stock.symbol} 
            stock={stock} 
            showAfterHours={stock.market === 'US'}
          />
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <div className="text-4xl mb-4">📭</div>
          <div>暂无股票</div>
        </div>
      )}

      {/* 底部新闻提示 */}
      <div className="fixed bottom-16 left-0 right-0 bg-gray-900/95 border-t border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">N</span>
          <span className="text-gray-300 flex-1 truncate">争做"英伟达平替"，地平线悬了吗？</span>
          <button className="text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 底部导航 - 长桥风格 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1117] border-t border-gray-800">
        <div className="max-w-lg mx-auto flex">
          {[
            { icon: '📋', activeIcon: '📋', label: '关注', href: '/', active: true },
            { icon: '🌐', activeIcon: '🌐', label: '市场', href: '/market', active: false },
            { icon: '📰', activeIcon: '📰', label: '动态', href: '/news', active: false },
            { icon: '💰', activeIcon: '💰', label: '资产', href: '/positions', active: false },
            { icon: '👤', activeIcon: '👤', label: '我的', href: '/account', active: false },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 ${
                item.active ? 'text-green-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{item.active ? item.activeIcon : item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
