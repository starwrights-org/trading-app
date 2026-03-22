'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_POSITIONS, MOCK_ACCOUNT } from '@/lib/mockData';
import { useTheme } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

export default function PositionsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const isMidnight = theme === 'midnight';
  const bgColor = isMidnight ? 'bg-[#0d1421]' : isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50';
  
  const [showAmount, setShowAmount] = useState(true);
  const [expandedMarket, setExpandedMarket] = useState<'US' | 'HK' | null>('US');

  const usPositions = MOCK_POSITIONS.filter(p => p.market === 'US');
  const hkPositions = MOCK_POSITIONS.filter(p => p.market === 'HK');

  const usTotal = usPositions.reduce((sum, p) => sum + p.marketValue, 0);
  const hkTotal = hkPositions.reduce((sum, p) => sum + p.marketValue, 0);
  
  const usProfitLoss = usPositions.reduce((sum, p) => sum + p.profitLoss, 0);
  const hkProfitLoss = hkPositions.reduce((sum, p) => sum + p.profitLoss, 0);

  const quickLinks = [
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: '订单', href: '/orders' },
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: '资金', href: '/fund-records' },
    { icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', label: '大厅', href: '/trading-hall' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: '换汇', href: '/currency-exchange' },
  ];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-black'} pb-20`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">资产</h1>
            <Link href="/search" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}>
              <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5">
        {/* 总资产卡片 */}
        <div className={`p-5 rounded-3xl ${isDark ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.03]' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>总资产 (HKD)</span>
            <button onClick={() => setShowAmount(!showAmount)} className="opacity-50 hover:opacity-80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {showAmount ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                )}
              </svg>
            </button>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold tabular-nums">
                {showAmount ? MOCK_ACCOUNT.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>当日盈亏</div>
              <div className={`text-xl font-semibold tabular-nums ${MOCK_ACCOUNT.todayProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {MOCK_ACCOUNT.todayProfitLoss >= 0 ? '+' : ''}{MOCK_ACCOUNT.todayProfitLoss.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10">
            <div>
              <div className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>持仓市值</div>
              <div className="font-medium tabular-nums">{MOCK_ACCOUNT.marketValue.toLocaleString()}</div>
            </div>
            <div>
              <div className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>持仓盈亏</div>
              <div className={`font-medium tabular-nums ${MOCK_ACCOUNT.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {MOCK_ACCOUNT.totalProfitLoss >= 0 ? '+' : ''}{MOCK_ACCOUNT.totalProfitLoss.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>现金</div>
              <div className="font-medium tabular-nums">{MOCK_ACCOUNT.cashBalance.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="flex justify-between py-6">
          {quickLinks.map(item => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                isDark ? 'bg-white/5' : 'bg-gray-100'
              }`}>
                <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <span className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 持仓分布标题 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">持仓分布</h2>
        </div>

        {/* 美股持仓 */}
        <div className={`rounded-2xl overflow-hidden mb-3 ${
          isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'
        }`}>
          <button 
            onClick={() => setExpandedMarket(expandedMarket === 'US' ? null : 'US')}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                <span className="text-lg">🇺🇸</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">美股</div>
                <div className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  {usPositions.length} 只股票
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold tabular-nums">{usTotal.toLocaleString()}</div>
                <div className={`text-sm tabular-nums ${usProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {usProfitLoss >= 0 ? '+' : ''}{usProfitLoss.toFixed(2)}
                </div>
              </div>
              <svg className={`w-5 h-5 transition-transform ${expandedMarket === 'US' ? 'rotate-180' : ''} opacity-40`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {expandedMarket === 'US' && (
            <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              {usPositions.map(position => (
                <Link
                  key={position.symbol}
                  href={`/stock/${position.market}/${position.symbol}`}
                  className={`flex items-center justify-between p-4 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition`}
                >
                  <div>
                    <div className="font-medium">{position.name}</div>
                    <div className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{position.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium tabular-nums">{position.currentPrice.toFixed(2)}</div>
                    <div className={`text-sm tabular-nums ${position.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 港股持仓 */}
        <div className={`rounded-2xl overflow-hidden mb-3 ${
          isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'
        }`}>
          <button 
            onClick={() => setExpandedMarket(expandedMarket === 'HK' ? null : 'HK')}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-rose-500/20' : 'bg-rose-50'}`}>
                <span className="text-lg">🇭🇰</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">港股</div>
                <div className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  {hkPositions.length} 只股票
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold tabular-nums">{hkTotal.toLocaleString()}</div>
                <div className={`text-sm tabular-nums ${hkProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {hkProfitLoss >= 0 ? '+' : ''}{hkProfitLoss.toFixed(2)}
                </div>
              </div>
              <svg className={`w-5 h-5 transition-transform ${expandedMarket === 'HK' ? 'rotate-180' : ''} opacity-40`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {expandedMarket === 'HK' && (
            <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              {hkPositions.map(position => (
                <Link
                  key={position.symbol}
                  href={`/stock/${position.market}/${position.symbol}`}
                  className={`flex items-center justify-between p-4 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition`}
                >
                  <div>
                    <div className="font-medium">{position.name}</div>
                    <div className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{position.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium tabular-nums">{position.currentPrice.toFixed(3)}</div>
                    <div className={`text-sm tabular-nums ${position.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 其他资产类型 */}
        {[
          { icon: '📊', name: '基金', value: '0.00' },
          { icon: '📜', name: '债券', value: '0.00' },
          { icon: '🏗️', name: '结构化产品', value: '0.00' },
        ].map(item => (
          <div key={item.name} className={`flex items-center justify-between p-4 rounded-2xl mb-3 ${
            isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <span className="font-medium">{item.name}</span>
            </div>
            <span className={`font-medium tabular-nums ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <BottomNav active="positions" />
    </main>
  );
}
