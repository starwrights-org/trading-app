'use client';

import { useState } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 快捷入口
const QUICK_LINKS = [
  { icon: '🏛', label: '美股 ETF', color: 'bg-blue-600' },
  { icon: 'VS', label: '股票 VS', color: 'bg-blue-500' },
  { icon: '📰', label: '新股申购', color: 'bg-red-500' },
  { icon: '≡', label: '行业/概念', color: 'bg-blue-600' },
  { icon: '⊞', label: '更多', color: 'bg-gray-500' },
];

// 热股异动事件
const HOT_EVENTS = [
  {
    name: '阿里巴巴',
    symbol: 'BABA',
    market: 'US',
    time: '03.20 15:48 美东',
    event: '跌幅达',
    change: -2.18,
    note: '波动超 20 日均值',
    tags: ['零售商'],
  },
  {
    name: '超微电脑',
    symbol: 'SMCI',
    market: 'US',
    time: '03.20 15:43',
    event: '跌幅达',
    change: -5.32,
    note: '波动超 20 日',
    tags: ['硬件、存储...'],
  },
  {
    name: '英伟达',
    symbol: 'NVDA',
    market: 'US',
    time: '03.20 15:30',
    event: '跌幅达',
    change: -3.15,
    note: '波动超 20 日均值',
    tags: ['芯片'],
  },
];

// 新股
const IPO_STOCKS = [
  {
    name: '同仁堂医养',
    logo: '同',
    prediction: '预测 8 倍',
    desc: '一家领先的中医医疗集团',
    deadline: '03.24 17:00',
    daysLeft: 3,
    canSubscribe: 5,
    darkPool: 2,
    listed: 0,
  },
];

// 财报预告股票
const EARNINGS_STOCKS = [
  { name: '小米集团-W', symbol: '01810', market: 'HK', price: 33.20, change: -2.35 },
  { name: '中国电信', symbol: '00728', market: 'HK', price: 5.12, change: 0.79 },
  { name: '拼多多', symbol: 'PDD', market: 'US', price: 112.45, change: -1.23 },
  { name: '美团-W', symbol: '03690', market: 'HK', price: 79.15, change: -2.88 },
];

export default function MarketPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'discover' | 'market' | 'fund'>('discover');
  const [earningsTab, setEarningsTab] = useState<'forecast' | 'watchlist'>('forecast');

  const tabs = [
    { key: 'discover', label: '发现' },
    { key: 'market', label: '市场' },
    { key: 'fund', label: '基金' },
  ];

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Tab 切换 */}
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`text-lg font-medium transition ${
                  activeTab === tab.key
                    ? `${colors.text} font-bold`
                    : colors.textMuted
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
      </div>

      <div className="max-w-lg mx-auto">
        {/* 快捷入口 */}
        <div className="px-4 py-4">
          <div className="flex justify-between">
            {QUICK_LINKS.map((link, idx) => (
              <button key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                  {link.icon}
                </div>
                <span className={`text-xs ${colors.textSecondary}`}>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 热股异动事件 */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${colors.text}`}>热股异动事件</h2>
            <button className={`text-sm ${colors.textMuted} flex items-center gap-1`}>
              03.21 03:49 更新
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 横向滚动卡片 */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {HOT_EVENTS.map((event, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-48 p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold ${colors.text}`}>{event.name}</span>
                  <span className="text-blue-500 text-sm">{event.market}</span>
                  <span className={`text-sm ${colors.textMuted}`}>{event.symbol}</span>
                </div>
                <div className={`text-xs ${colors.textMuted} mb-1`}>{event.time}</div>
                <div className="flex items-center gap-1 mb-1">
                  <span className={colors.textSecondary}>{event.event}</span>
                  <span className="text-red-500 font-medium">{event.change.toFixed(2)}%</span>
                </div>
                <div className={`text-xs ${colors.textMuted} mb-2`}>{event.note}</div>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded border ${colors.border} ${colors.textMuted}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新股 */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${colors.text}`}>新股</h2>
            <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {IPO_STOCKS.map((ipo, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}>
              <div className="flex gap-4">
                {/* Logo */}
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-red-600 text-2xl font-bold">{ipo.logo}</span>
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${colors.text}`}>{ipo.name}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-red-500 text-white rounded">{ipo.prediction}</span>
                  </div>
                  <div className={`text-sm ${colors.textMuted} mt-1`}>{ipo.desc}</div>
                  <div className={`text-sm ${colors.textMuted} mt-2`}>
                    认购截止：{ipo.deadline} 剩余 <span className="text-orange-500">{ipo.daysLeft} 天</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={`flex justify-between mt-4 pt-4 border-t ${colors.border}`}>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">💰</span>
                  <span className={colors.textSecondary}>可认购</span>
                  <span className={`font-bold ${colors.text}`}>{ipo.canSubscribe}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={colors.textMuted}>📊</span>
                  <span className={colors.textSecondary}>暗盘</span>
                  <span className={`font-bold ${colors.text}`}>{ipo.darkPool}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">📈</span>
                  <span className={colors.textSecondary}>上市</span>
                  <span className={`font-bold ${colors.text}`}>{ipo.listed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 财报预告 */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEarningsTab('forecast')}
                className={`text-lg font-medium ${earningsTab === 'forecast' ? `${colors.text} font-bold` : colors.textMuted}`}
              >
                财报预告
              </button>
              <button
                onClick={() => setEarningsTab('watchlist')}
                className={`text-lg font-medium ${earningsTab === 'watchlist' ? `${colors.text} font-bold` : colors.textMuted}`}
              >
                自选
              </button>
            </div>
            <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 横向滚动股票卡片 */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {EARNINGS_STOCKS.map((stock, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-32 p-3 rounded-xl border ${colors.border} ${colors.bgCard}`}
              >
                <div className={`font-medium ${colors.text} text-sm truncate`}>{stock.name}</div>
                <div className={`text-xs ${colors.textMuted} mt-1`}>
                  <span className="text-blue-500">{stock.market}</span> {stock.symbol}
                </div>
                <div className={`text-lg font-bold mt-2 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.price.toFixed(2)}
                </div>
                <div className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="market" />
    </main>
  );
}
