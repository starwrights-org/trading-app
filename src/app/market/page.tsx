'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 美股指数数据
const US_INDICES = [
  { name: '道琼斯', symbol: 'DJI', price: 45577.47, change: -0.96 },
  { name: '纳斯达克', symbol: 'IXIC', price: 21647.61, change: -2.01 },
  { name: '标普500', symbol: 'SPY', price: 648.57, change: -1.43 },
];

// 港股指数数据
const HK_INDICES = [
  { name: '恒生指数', symbol: 'HSI', price: 25277.32, change: 0.88 },
  { name: '国企指数', symbol: 'HSCEI', price: 8574.07, change: -1.40 },
  { name: '恒生科技', symbol: 'HSTECH', price: 4872.38, change: -2.48 },
];

// 热股异动
const HOT_STOCKS = [
  { name: '阿里巴巴', symbol: 'BABA', market: 'US', change: -2.18 },
  { name: '超微电脑', symbol: 'SMCI', market: 'US', change: -5.32 },
  { name: '英伟达', symbol: 'NVDA', market: 'US', change: -3.15 },
  { name: '腾讯控股', symbol: '00700', market: 'HK', change: 1.25 },
];

// 新股
const IPO_STOCKS = [
  { name: '同仁堂医养', desc: '中医医疗集团', prediction: '8倍', daysLeft: 3 },
];

// 基金
const TOP_FUNDS = [
  { type: '股票型', return: '+124.86%', period: '近3年', name: '摩根日本基金' },
  { type: '债券型', return: '+28.88%', period: '近5年', name: '泰康短期债券基金' },
  { type: '平衡型', return: '+79.96%', period: '近3年', name: '中银全天候投资基金' },
];

export default function MarketPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const isMidnight = theme === 'midnight';
  const bgColor = isMidnight ? 'bg-[#0d1421]' : isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50';
  
  const [mainTab, setMainTab] = useState<'discover' | 'market' | 'fund' | 'bond' | 'structured' | 'insurance'>('discover');
  const [marketTab, setMarketTab] = useState<'us' | 'hk'>('us');

  const indices = marketTab === 'us' ? US_INDICES : HK_INDICES;

  const mainTabs = [
    { key: 'discover', label: '发现' },
    { key: 'market', label: '市场' },
    { key: 'fund', label: '基金' },
    { key: 'bond', label: '债券' },
    { key: 'structured', label: '结构化' },
    { key: 'insurance', label: '保险' },
  ];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            {/* 主 Tab */}
            <div className="flex gap-5 overflow-x-auto flex-1 mr-4 scrollbar-hide">
              {mainTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setMainTab(tab.key as typeof mainTab)}
                  className={`text-xl font-bold transition whitespace-nowrap ${
                    mainTab === tab.key 
                      ? isDark ? 'text-white' : 'text-black' 
                      : isDark ? 'text-white/30' : 'text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 搜索图标 */}
            <Link href="/search" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}>
              <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 市场 Tab 下的 美股/港股 切换 */}
        {mainTab === 'market' && (
          <div className="max-w-lg mx-auto px-5 pb-4">
            <div className={`inline-flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
              {(['us', 'hk'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setMarketTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    marketTab === tab
                      ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'us' ? '美股' : '港股'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-5">
        {/* ==================== 发现 Tab ==================== */}
        {mainTab === 'discover' && (
          <div className="space-y-6 pt-2">
            {/* 热股异动 */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>热股异动</h2>
                <span className={`text-[11px] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>实时更新</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {HOT_STOCKS.map((stock, idx) => (
                  <Link
                    key={idx}
                    href={`/stock/${stock.market}/${stock.symbol}/`}
                    className={`p-4 rounded-2xl transition-all duration-200 ${
                      isDark 
                        ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]' 
                        : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{stock.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        stock.market === 'US' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>{stock.market}</span>
                    </div>
                    <div className={`text-xl font-semibold tabular-nums ${stock.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 新股申购 */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>新股申购</h2>
                <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              {IPO_STOCKS.map((ipo, idx) => (
                <div key={idx} className={`p-4 rounded-2xl ${
                  isDark 
                    ? 'bg-white/[0.03] border border-white/[0.06]' 
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-rose-500/20' : 'bg-rose-50'
                    }`}>
                      <span className="text-rose-500 text-lg font-bold">同</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{ipo.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full">
                          预测 {ipo.prediction}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{ipo.desc}</p>
                      <div className={`text-sm mt-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        剩余 <span className="text-orange-500 font-medium">{ipo.daysLeft} 天</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* ==================== 市场 Tab ==================== */}
        {mainTab === 'market' && (
          <div className="space-y-6 pt-2">
            {/* 指数卡片 */}
            <div className="grid grid-cols-3 gap-3">
              {indices.map((index, idx) => {
                const isUp = index.change >= 0;
                return (
                  <div key={idx} className={`p-3 rounded-2xl ${
                    isDark 
                      ? 'bg-white/[0.03] border border-white/[0.06]' 
                      : 'bg-white border border-gray-100 shadow-sm'
                  }`}>
                    <div className={`text-[11px] mb-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{index.name}</div>
                    <div className={`text-base font-semibold tabular-nums ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                      {index.price.toLocaleString()}
                    </div>
                    <div className={`text-xs tabular-nums ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                      {isUp ? '+' : ''}{index.change.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 涨跌分布 */}
            <section className={`p-4 rounded-2xl ${
              isDark 
                ? 'bg-white/[0.03] border border-white/[0.06]' 
                : 'bg-white border border-gray-100 shadow-sm'
            }`}>
              <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>涨跌分布</h3>
              <div className="flex items-center gap-1 h-8">
                <div className="flex-1 h-full bg-green-500/80 rounded-l-lg"></div>
                <div className="w-8 h-full bg-gray-500/50"></div>
                <div className="flex-[0.3] h-full bg-red-500/80 rounded-r-lg"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-green-500">跌 70%</span>
                <span className={isDark ? 'text-white/40' : 'text-gray-400'}>平 16%</span>
                <span className="text-red-500">涨 14%</span>
              </div>
            </section>
          </div>
        )}

        {/* ==================== 基金 Tab ==================== */}
        {mainTab === 'fund' && (
          <div className="space-y-6 pt-2">
            <section>
              <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>收益排行</h2>
              <div className="space-y-3">
                {TOP_FUNDS.map((fund, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl ${
                    isDark 
                      ? 'bg-white/[0.03] border border-white/[0.06]' 
                      : 'bg-white border border-gray-100 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600'
                        }`}>{fund.type}</span>
                        <div className={`mt-2 font-medium ${isDark ? 'text-white' : 'text-black'}`}>{fund.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-orange-500">{fund.return}</div>
                        <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{fund.period}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== 债券 Tab ==================== */}
        {mainTab === 'bond' && (
          <div className="py-12 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>债券投资</h2>
            <p className={`mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>美国国债、企业债、高收益债</p>
            <div className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-white/[0.03]' : 'bg-white shadow-sm'}`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-green-500">4.25%</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>10年期国债</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-orange-500">5.50%</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>企业债</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-red-500">7.80%</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>高收益债</div>
                </div>
              </div>
            </div>
            <p className={`mt-6 text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>敬请期待</p>
          </div>
        )}

        {/* ==================== 结构化产品 Tab ==================== */}
        {mainTab === 'structured' && (
          <div className="py-12 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>结构化产品</h2>
            <p className={`mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>ELN、FCN、雪球结构</p>
            <div className={`mt-6 space-y-3`}>
              {[
                { name: '股票挂钩票据 (ELN)', yield: '8-15%' },
                { name: '固定派息票据 (FCN)', yield: '10-20%' },
                { name: '雪球结构', yield: '15-25%' },
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl ${
                  isDark ? 'bg-white/[0.03]' : 'bg-white shadow-sm'
                }`}>
                  <span className={isDark ? 'text-white' : 'text-black'}>{item.name}</span>
                  <span className="text-orange-500 font-semibold">年化 {item.yield}</span>
                </div>
              ))}
            </div>
            <p className={`mt-6 text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>敬请期待</p>
          </div>
        )}

        {/* ==================== 保险 Tab ==================== */}
        {mainTab === 'insurance' && (
          <div className="py-12 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>保险产品</h2>
            <p className={`mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>储蓄险、人寿险、医疗险</p>
            <div className={`mt-6 space-y-3`}>
              {[
                { icon: '💰', name: '储蓄分红险', tag: '稳定增值', color: 'text-green-500' },
                { icon: '❤️', name: '人寿保障险', tag: '保障全面', color: 'text-blue-500' },
                { icon: '🏥', name: '高端医疗险', tag: '全球理赔', color: 'text-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl ${
                  isDark ? 'bg-white/[0.03]' : 'bg-white shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className={isDark ? 'text-white' : 'text-black'}>{item.name}</span>
                  </div>
                  <span className={`font-medium ${item.color}`}>{item.tag}</span>
                </div>
              ))}
            </div>
            <p className={`mt-6 text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>敬请期待</p>
          </div>
        )}
      </div>

      <BottomNav active="market" />
    </main>
  );
}
