'use client';

import Link from 'next/link';
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

// 快捷入口
const QUICK_LINKS = [
  { icon: '🏛', label: '美股 ETF', color: 'bg-blue-600' },
  { icon: 'VS', label: '股票 VS', color: 'bg-blue-500' },
  { icon: '📰', label: '新股申购', color: 'bg-red-500' },
  { icon: '≡', label: '行业/概念', color: 'bg-blue-600' },
  { icon: '⊞', label: '更多', color: 'bg-gray-500' },
];

// 热股异动
const HOT_EVENTS = [
  { name: '阿里巴巴', symbol: 'BABA', market: 'US', time: '03.20 15:48', event: '跌幅达', change: -2.18, tags: ['零售商'] },
  { name: '超微电脑', symbol: 'SMCI', market: 'US', time: '03.20 15:43', event: '跌幅达', change: -5.32, tags: ['硬件'] },
  { name: '英伟达', symbol: 'NVDA', market: 'US', time: '03.20 15:30', event: '跌幅达', change: -3.15, tags: ['芯片'] },
];

// 新股
const IPO_STOCKS = [
  { name: '同仁堂医养', logo: '同', prediction: '预测 8 倍', desc: '一家领先的中医医疗集团', deadline: '03.24 17:00', daysLeft: 3, canSubscribe: 5, darkPool: 2, listed: 0 },
];

// 财报预告股票
const EARNINGS_STOCKS = [
  { name: '小米集团-W', symbol: '01810', market: 'HK', price: 33.20, change: -2.35 },
  { name: '中国电信', symbol: '00728', market: 'HK', price: 5.12, change: 0.79 },
  { name: '拼多多', symbol: 'PDD', market: 'US', price: 112.45, change: -1.23 },
  { name: '美团-W', symbol: '03690', market: 'HK', price: 79.15, change: -2.88 },
];

// 基金快捷入口
const FUND_QUICK_LINKS = [
  { icon: '💰', label: '盈和宝', color: 'bg-orange-500' },
  { icon: '📋', label: '基金订单', color: 'bg-blue-500' },
  { icon: '📊', label: '基金排行', color: 'bg-red-500' },
  { icon: '📈', label: '债券基金', color: 'bg-orange-400' },
  { icon: '⊞', label: '更多', color: 'bg-blue-600' },
];

// 收益最佳基金
const TOP_FUNDS = [
  { type: '股票型', return: '+124.86%', period: '近 3 年', name: '摩根日本（日圆）基金 - US...' },
  { type: '债券型', return: '+28.88%', period: '近 5 年', name: '泰康开泰海外短期债券基金...' },
  { type: '平衡型', return: '+79.96%', period: '近 3 年', name: '中银香港全天候环球投资基...' },
  { type: '货币型', return: '+19.77%', period: '近 5 年', name: '易方达(香港)美元货币市场...' },
];

// 基金公司
const FUND_COMPANIES = [
  { name: '东亚联丰投资管理有限公司', logo: '东亞\n聯豐投', color: 'bg-red-600' },
  { name: '泰康资产管理(香港)有限公司', logo: '泰康\nTaikan', color: 'bg-blue-600' },
  { name: '大成国际资产管理有限公司', logo: '资产管', color: 'bg-blue-500' },
  { name: '汇丰投资(香港)有限公司', logo: 'CA', color: 'bg-red-500' },
];

// 热销基金
const HOT_FUNDS = [
  { rank: 1, name: '博时美元货币市场基金 I USD Acc', return: '+4.28%', period: '近 1 年', tags: ['USD', '货币型', '低风险'] },
  { rank: 2, name: '易方达(香港)美元货币市场基金 I US...', return: '+15.74%', period: '近 3 年', tags: ['USD', '货币型', '低风险'] },
  { rank: 3, name: '博时美元货币市场基金A USD Acc', return: '+4.23%', period: '近 1 年', tags: ['USD', '货币型', '低风险'] },
  { rank: 4, name: '华夏精选美元货币基金 Class I USD', return: '+4.44%', period: '近 1 年', tags: ['USD', '货币型', '低风险'] },
];

export default function MarketPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  // 底部大 Tab：发现/市场/基金
  const [mainTab, setMainTab] = useState<'discover' | 'market' | 'fund'>('discover');
  // 市场内的小 Tab：美股/港股
  const [marketTab, setMarketTab] = useState<'us' | 'hk'>('us');
  const [earningsTab, setEarningsTab] = useState<'forecast' | 'watchlist'>('forecast');

  const indices = marketTab === 'us' ? US_INDICES : HK_INDICES;
  const temp = marketTab === 'us' ? MARKET_TEMP.US : MARKET_TEMP.HK;
  const dist = marketTab === 'us' ? DISTRIBUTION.US : DISTRIBUTION.HK;

  const allCounts = [...dist.down.ranges.map(r => r.count), dist.flat.total, ...dist.up.ranges.map(r => r.count)];
  const maxCount = Math.max(...allCounts);

  const mainTabs = [
    { key: 'discover', label: '发现' },
    { key: 'market', label: '市场' },
    { key: 'fund', label: '基金' },
  ];

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* 主 Tab：发现/市场/基金 */}
          <div className="flex gap-4">
            {mainTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key as typeof mainTab)}
                className={`text-lg font-medium transition ${
                  mainTab === tab.key ? `${colors.text} font-bold` : colors.textMuted
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search" className={colors.textSecondary}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button className={colors.textSecondary}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* 市场 Tab 下的 美股/港股 切换 */}
        {mainTab === 'market' && (
          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setMarketTab('us')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  marketTab === 'us'
                    ? 'bg-gray-800 text-white'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                美股
              </button>
              <button
                onClick={() => setMarketTab('hk')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  marketTab === 'hk'
                    ? 'bg-gray-800 text-white'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                港股
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* ==================== 发现 Tab ==================== */}
        {mainTab === 'discover' && (
          <>
            {/* 快捷入口 */}
            <div className="py-4">
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
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${colors.text}`}>热股异动事件</h2>
                <button className={`text-sm ${colors.textMuted} flex items-center gap-1`}>
                  03.21 03:49 更新
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {HOT_EVENTS.map((event, idx) => (
                  <div key={idx} className={`flex-shrink-0 w-48 p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold ${colors.text}`}>{event.name}</span>
                      <span className="text-blue-500 text-sm">{event.market}</span>
                    </div>
                    <div className={`text-xs ${colors.textMuted} mb-1`}>{event.time}</div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className={colors.textSecondary}>{event.event}</span>
                      <span className="text-red-500 font-medium">{event.change.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded border ${colors.border} ${colors.textMuted}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 新股 */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${colors.text}`}>新股</h2>
                <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {IPO_STOCKS.map((ipo, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                      <span className="text-red-600 text-2xl font-bold">{ipo.logo}</span>
                    </div>
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
            <div className="py-4">
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

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {EARNINGS_STOCKS.map((stock, idx) => (
                  <div key={idx} className={`flex-shrink-0 w-32 p-3 rounded-xl border ${colors.border} ${colors.bgCard}`}>
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
          </>
        )}

        {/* ==================== 市场 Tab ==================== */}
        {mainTab === 'market' && (
          <>
            {/* 指数卡片 */}
            <div className="grid grid-cols-3 gap-3 mb-6 pt-2">
              {indices.map((index, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${colors.border} ${colors.bgCard}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${colors.textSecondary}`}>{index.name}</span>
                  </div>
                  <div className={`text-lg font-bold ${index.change >= 0 ? 'text-green-500' : 'text-cyan-500'}`}>
                    {index.price.toLocaleString('en-US', { minimumFractionDigits: 3 })}
                  </div>
                  <div className={`text-sm ${index.change >= 0 ? 'text-green-500' : 'text-cyan-500'}`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
                  </div>
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
                <div className="relative w-32 h-20">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <defs>
                      <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="url(#tempGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${temp.temp * 1.26} 126`} />
                    <line x1="50" y1="55" x2={50 + 30 * Math.cos((180 - temp.temp * 1.8) * Math.PI / 180)} y2={55 - 30 * Math.sin((180 - temp.temp * 1.8) * Math.PI / 180)} stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="55" r="4" fill={theme === 'dark' ? '#fff' : '#000'} />
                  </svg>
                  <div className={`absolute bottom-0 left-0 text-xs ${colors.textMuted}`}>0°</div>
                  <div className={`absolute bottom-0 right-0 text-xs ${colors.textMuted}`}>100°</div>
                </div>

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

              <div className="flex items-end justify-center gap-1 h-40 mb-4">
                {dist.down.ranges.map((range, idx) => (
                  <div key={`down-${idx}`} className="flex flex-col items-center">
                    <span className={`text-xs ${colors.textMuted} mb-1`}>{range.count}</span>
                    <div className={`w-8 ${range.color} rounded-t`} style={{ height: `${(range.count / maxCount) * 100}px` }} />
                    <span className={`text-xs ${colors.textMuted} mt-1`}>{range.label}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center">
                  <span className={`text-xs ${colors.textMuted} mb-1`}>{dist.flat.total}</span>
                  <div className="w-8 bg-gray-400 rounded-t" style={{ height: `${(dist.flat.total / maxCount) * 100}px` }} />
                  <span className={`text-xs ${colors.textMuted} mt-1`}>0%</span>
                </div>
                {dist.up.ranges.map((range, idx) => (
                  <div key={`up-${idx}`} className="flex flex-col items-center">
                    <span className={`text-xs text-orange-500 mb-1`}>{range.count}</span>
                    <div className={`w-8 ${range.color} rounded-t`} style={{ height: `${(range.count / maxCount) * 100}px` }} />
                    <span className={`text-xs ${colors.textMuted} mt-1`}>{range.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-cyan-500">↓ 下跌 <span className="font-bold">{dist.down.total.toLocaleString()}家</span></span>
                <span className={colors.textMuted}>— 平 <span className="font-bold">{dist.flat.total.toLocaleString()}家</span></span>
                <span className="text-orange-500">↑ 上涨 <span className="font-bold">{dist.up.total.toLocaleString()}家</span></span>
              </div>
            </div>
          </>
        )}

        {/* ==================== 基金 Tab ==================== */}
        {mainTab === 'fund' && (
          <>
            {/* 基金快捷入口 */}
            <div className="py-4">
              <div className="flex justify-between">
                {FUND_QUICK_LINKS.map((link, idx) => (
                  <button key={idx} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                      {link.icon}
                    </div>
                    <span className={`text-xs ${colors.textSecondary}`}>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 风险水平 + 优选 */}
            <div className={`p-4 rounded-xl ${colors.bgCard} mb-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className={colors.textSecondary}>您的风险水平</span>
                <span className={colors.text}>待评测</span>
                <svg className={`w-4 h-4 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 border border-orange-500 text-orange-500 rounded">优选</span>
                  <span className={colors.textMuted}>--</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">0.00%</div>
              </div>
            </div>

            {/* 收益最佳 */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${colors.text}`}>收益最佳</h2>
                <span className={`text-sm ${colors.textMuted}`}>更新日期 2026-03-21 &gt;</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TOP_FUNDS.map((fund, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}>
                    <div className={`font-medium ${colors.text} mb-2`}>{fund.type}</div>
                    <div className="text-orange-500 text-xl font-bold">{fund.return}</div>
                    <div className={`text-xs ${colors.textMuted} mb-2`}>{fund.period}</div>
                    <div className={`text-sm ${colors.textSecondary} truncate`}>{fund.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 基金公司 */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${colors.text}`}>基金公司</h2>
                <span className={`text-sm ${colors.textMuted}`}>更多 &gt;</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {FUND_COMPANIES.map((company, idx) => (
                  <div key={idx} className="flex-shrink-0 w-28 flex flex-col items-center">
                    <div className={`w-20 h-20 ${company.color} rounded-xl flex items-center justify-center text-white font-bold text-center text-sm leading-tight mb-2`}>
                      {company.logo.split('\n').map((line, i) => (
                        <span key={i}>{line}<br/></span>
                      ))}
                    </div>
                    <span className={`text-xs ${colors.textSecondary} text-center leading-tight`}>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 热销基金 */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${colors.text}`}>热销基金</h2>
              </div>

              <div className="space-y-4">
                {HOT_FUNDS.map((fund, idx) => (
                  <div key={idx} className={`flex gap-4 p-4 rounded-xl border ${colors.border} ${colors.bgCard}`}>
                    {/* 排名 + 走势图 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${fund.rank <= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        TOP {fund.rank}
                      </span>
                      {/* 迷你走势 */}
                      <div className="mt-2 w-16 h-8">
                        <svg viewBox="0 0 60 30" className="w-full h-full">
                          <path
                            d={`M 0 25 Q 15 ${20 - fund.rank * 2} 30 ${15 + fund.rank} T 60 ${10 - fund.rank}`}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 基金信息 */}
                    <div className="flex-1">
                      <div className={`font-medium ${colors.text} mb-1`}>{fund.name}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-orange-500 font-bold">{fund.return}</span>
                        <span className={`text-xs ${colors.textMuted}`}>{fund.period}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {fund.tags.map((tag, i) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded border ${colors.border} ${colors.textMuted}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav active="market" />
    </main>
  );
}
