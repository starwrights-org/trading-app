'use client';

import { useState } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 美股指数数据
const US_INDICES = [
  { name: '道琼斯', symbol: 'DJI', price: 45577.470, change: -0.96, miniChart: '📉' },
  { name: '纳斯达克', symbol: 'IXIC', price: 21647.611, change: -2.01, miniChart: '📉' },
  { name: '标普 500 ETF', symbol: 'SPY', price: 648.570, change: -1.43, miniChart: '📉' },
];

// 港股指数数据
const HK_INDICES = [
  { name: '恒生指数', symbol: 'HSI', price: 25277.320, change: -0.88, miniChart: '📈' },
  { name: '国企指数', symbol: 'HSCEI', price: 8574.070, change: -1.40, miniChart: '📉' },
  { name: '恒生科技', symbol: 'HSTECH', price: 4872.380, change: -2.48, miniChart: '📉' },
];

// 市场温度数据
const MARKET_TEMP = {
  US: { temp: 33, trend: '温度适宜并逐渐下降中', valuation: '正常', sentiment: '冰冻', sentimentColor: 'text-cyan-500' },
  HK: { temp: 58, trend: '温度适宜并逐渐上升中', valuation: '高', sentiment: '平静', sentimentColor: 'text-green-500' },
};

// 涨跌分布数据
const DISTRIBUTION = {
  US: {
    updateTime: '03.20 16:00',
    down: { total: 10258, ranges: [{ label: '>7%', count: 725, color: 'bg-cyan-600' }, { label: '5-7%', count: 545, color: 'bg-cyan-500' }, { label: '3-5%', count: 1723, color: 'bg-cyan-400' }, { label: '0-3%', count: 7265, color: 'bg-cyan-300' }] },
    flat: { total: 2316 },
    up: { total: 2053, ranges: [{ label: '0-3%', count: 1419, color: 'bg-orange-300' }, { label: '3-5%', count: 204, color: 'bg-orange-400' }, { label: '5-7%', count: 114, color: 'bg-orange-500' }, { label: '>7%', count: 316, color: 'bg-orange-600' }] },
  },
  HK: {
    updateTime: '03.20 17:13',
    down: { total: 1509, ranges: [{ label: '>7%', count: 95, color: 'bg-cyan-600' }, { label: '5-7%', count: 130, color: 'bg-cyan-500' }, { label: '3-5%', count: 243, color: 'bg-cyan-400' }, { label: '0-3%', count: 1041, color: 'bg-cyan-300' }] },
    flat: { total: 883 },
    up: { total: 780, ranges: [{ label: '0-3%', count: 543, color: 'bg-orange-300' }, { label: '3-5%', count: 111, color: 'bg-orange-400' }, { label: '5-7%', count: 55, color: 'bg-orange-500' }, { label: '>7%', count: 71, color: 'bg-orange-600' }] },
  },
};

export default function MarketPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'us' | 'hk'>('us');

  const indices = activeTab === 'us' ? US_INDICES : HK_INDICES;
  const temp = activeTab === 'us' ? MARKET_TEMP.US : MARKET_TEMP.HK;
  const dist = activeTab === 'us' ? DISTRIBUTION.US : DISTRIBUTION.HK;

  // 计算柱状图最大值
  const allCounts = [...dist.down.ranges.map(r => r.count), dist.flat.total, ...dist.up.ranges.map(r => r.count)];
  const maxCount = Math.max(...allCounts);

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">市场</h1>
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

        {/* 美股/港股 Tab */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
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
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* 指数卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {indices.map((index, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${colors.border} ${colors.bgCard}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${colors.textSecondary}`}>{index.name}</span>
                <span className={`text-xs ${colors.textMuted}`}>≡</span>
              </div>
              <div className={`text-lg font-bold ${index.change >= 0 ? 'text-green-500' : 'text-cyan-500'}`}>
                {index.price.toLocaleString('en-US', { minimumFractionDigits: 3 })}
              </div>
              <div className={`text-sm ${index.change >= 0 ? 'text-green-500' : 'text-cyan-500'}`}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
              </div>
              {/* Mini Chart 占位 */}
              <div className={`h-8 mt-2 flex items-end gap-0.5`}>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${index.change >= 0 ? 'bg-green-500/30' : 'bg-cyan-500/30'}`}
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 市场温度 */}
        <div className={`p-4 rounded-xl border ${colors.border} ${colors.bgCard} mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${colors.text}`}>市场温度</h2>
            <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className="flex items-center gap-6">
            {/* 温度计 */}
            <div className="relative w-32 h-20">
              {/* 半圆背景 */}
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <defs>
                  <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                {/* 背景弧 */}
                <path
                  d="M 10 55 A 40 40 0 0 1 90 55"
                  fill="none"
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* 彩色弧 */}
                <path
                  d="M 10 55 A 40 40 0 0 1 90 55"
                  fill="none"
                  stroke="url(#tempGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${temp.temp * 1.26} 126`}
                />
                {/* 指针 */}
                <line
                  x1="50"
                  y1="55"
                  x2={50 + 30 * Math.cos((180 - temp.temp * 1.8) * Math.PI / 180)}
                  y2={55 - 30 * Math.sin((180 - temp.temp * 1.8) * Math.PI / 180)}
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="55" r="4" fill={theme === 'dark' ? '#fff' : '#000'} />
              </svg>
              {/* 刻度 */}
              <div className={`absolute bottom-0 left-0 text-xs ${colors.textMuted}`}>0°</div>
              <div className={`absolute bottom-0 right-0 text-xs ${colors.textMuted}`}>100°</div>
            </div>

            {/* 温度信息 */}
            <div className="flex-1">
              <div className={`text-4xl font-bold ${temp.temp > 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                {temp.temp}°
              </div>
              <div className={`text-sm ${colors.textMuted} mt-1`}>{temp.trend}</div>
              <div className="flex items-center gap-4 mt-2">
                <span className={colors.textSecondary}>
                  估值 <span className={temp.valuation === '高' ? 'text-orange-500' : 'text-green-500'}>{temp.valuation}</span>
                </span>
                <span className={colors.textSecondary}>
                  情绪 <span className={temp.sentimentColor}>{temp.sentiment}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 涨跌分布 */}
        <div className={`p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${colors.text}`}>涨跌分布</h2>
            <span className={`text-sm ${colors.textMuted}`}>{dist.updateTime} 更新</span>
          </div>

          {/* 柱状图 */}
          <div className="flex items-end justify-center gap-1 h-40 mb-4">
            {/* 跌 */}
            {dist.down.ranges.map((range, idx) => (
              <div key={`down-${idx}`} className="flex flex-col items-center">
                <span className={`text-xs ${colors.textMuted} mb-1`}>{range.count}</span>
                <div
                  className={`w-8 ${range.color} rounded-t`}
                  style={{ height: `${(range.count / maxCount) * 100}px` }}
                />
                <span className={`text-xs ${colors.textMuted} mt-1`}>{range.label}</span>
              </div>
            ))}
            {/* 平 */}
            <div className="flex flex-col items-center">
              <span className={`text-xs ${colors.textMuted} mb-1`}>{dist.flat.total}</span>
              <div
                className="w-8 bg-gray-400 rounded-t"
                style={{ height: `${(dist.flat.total / maxCount) * 100}px` }}
              />
              <span className={`text-xs ${colors.textMuted} mt-1`}>0%</span>
            </div>
            {/* 涨 */}
            {dist.up.ranges.map((range, idx) => (
              <div key={`up-${idx}`} className="flex flex-col items-center">
                <span className={`text-xs text-orange-500 mb-1`}>{range.count}</span>
                <div
                  className={`w-8 ${range.color} rounded-t`}
                  style={{ height: `${(range.count / maxCount) * 100}px` }}
                />
                <span className={`text-xs ${colors.textMuted} mt-1`}>{range.label}</span>
              </div>
            ))}
          </div>

          {/* 统计 */}
          <div className="flex justify-between text-sm">
            <span className="text-cyan-500">↓ 下跌 <span className="font-bold">{dist.down.total.toLocaleString()}家</span></span>
            <span className={colors.textMuted}>— 平 <span className="font-bold">{dist.flat.total.toLocaleString()}家</span></span>
            <span className="text-orange-500">↑ 上涨 <span className="font-bold">{dist.up.total.toLocaleString()}家</span></span>
          </div>
        </div>
      </div>

      <BottomNav active="market" />
    </main>
  );
}
