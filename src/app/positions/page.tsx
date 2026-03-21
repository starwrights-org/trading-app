'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_POSITIONS } from '@/lib/mockData';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

export default function PositionsPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'strategy'>('positions');
  const [showAmount, setShowAmount] = useState(true);
  const [expandedMarket, setExpandedMarket] = useState<'US' | 'HK' | null>('US');

  const usPositions = MOCK_POSITIONS.filter(p => p.market === 'US');
  const hkPositions = MOCK_POSITIONS.filter(p => p.market === 'HK');

  const usTotal = usPositions.reduce((sum, p) => sum + p.marketValue, 0);
  const hkTotal = hkPositions.reduce((sum, p) => sum + p.marketValue, 0);
  
  const usProfitLoss = usPositions.reduce((sum, p) => sum + p.profitLoss, 0);
  const hkProfitLoss = hkPositions.reduce((sum, p) => sum + p.profitLoss, 0);

  const usTodayPL = -213.95;
  const hkTodayPL = 156.30;

  const totalAssets = 799683.15;
  const todayPL = -1667.20;
  const positionValue = 72499.86;
  const positionPL = -143.66;
  const cashBalance = 727183.29;

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">模拟炒股 (8568)</span>
            <span className={colors.textMuted}>⇄</span>
          </div>
          <div className="flex items-center gap-4">
            <button className={`${colors.textSecondary} hover:${colors.text}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className={`${colors.textSecondary} hover:${colors.text}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 总资产区域 */}
        <div className="px-4 py-4">
          <div className={`flex items-center gap-2 text-sm ${colors.textSecondary} mb-2`}>
            <span>总资产 (HKD)</span>
            <span className={colors.textMuted}>▾</span>
            <span className={colors.textMuted}>ⓘ</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">
                {showAmount ? totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '******'}
              </span>
              <button onClick={() => setShowAmount(!showAmount)} className={colors.textMuted}>
                {showAmount ? '👁' : '👁‍🗨'}
              </button>
            </div>
            <div className="text-right">
              <div className={`text-xs ${colors.textMuted} mb-1`}>当日盈亏 ↗</div>
              <div className={`text-xl font-medium ${todayPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {todayPL >= 0 ? '+' : ''}{todayPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <div className={`${colors.textMuted} mb-1`}>持仓总市值</div>
              <div className="font-medium">{positionValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className={`${colors.textMuted} mb-1`}>持仓总盈亏</div>
              <div className={`font-medium ${positionPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {positionPL >= 0 ? '+' : ''}{positionPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <div className={`${colors.textMuted} mb-1`}>现金 &gt;</div>
              <div className="font-medium">{cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* 快捷功能入口 */}
        <div className={`grid grid-cols-5 gap-2 px-4 py-4 border-t border-b ${colors.border}`}>
          {[
            { icon: '📋', label: '订单查询', color: 'text-yellow-500', href: '/orders' },
            { icon: '📊', label: '资金记录', color: 'text-blue-500', href: '/fund-records' },
            { icon: '🏛', label: '交易大厅', color: 'text-red-500', href: '#' },
            { icon: '💱', label: '货币兑换', color: 'text-green-500', href: '/currency-exchange' },
            { icon: '⚙️', label: '全部功能', color: 'text-purple-500', href: '#' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center py-2">
              <span className={`text-2xl mb-1 ${item.color}`}>{item.icon}</span>
              <span className={`text-xs ${colors.textSecondary}`}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 持仓分布 Tab */}
        <div className="px-4 pt-4">
          <div className={`flex items-center gap-6 border-b ${colors.border} pb-3`}>
            <button
              onClick={() => setActiveTab('positions')}
              className={`font-medium ${activeTab === 'positions' ? colors.text : colors.textMuted}`}
            >
              持仓分布
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-sm ${activeTab === 'orders' ? colors.text : colors.textMuted}`}
            >
              当日订单 (0/0)
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`text-sm ${activeTab === 'strategy' ? colors.text : colors.textMuted}`}
            >
              策略订单
            </button>
            <div className="flex-1" />
            <button className={colors.textMuted}>⚙️</button>
          </div>
        </div>

        {/* 美股持仓 */}
        <div className="px-4 py-3">
          <button 
            onClick={() => setExpandedMarket(expandedMarket === 'US' ? null : 'US')}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              <span className="font-medium">美股</span>
              <span className="font-bold">{usTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className={`${colors.textMuted} text-sm`}>↗</span>
            </div>
            <span className={colors.textMuted}>{expandedMarket === 'US' ? '∧' : '∨'}</span>
          </button>

          {expandedMarket === 'US' && (
            <>
              <div className={`grid grid-cols-3 gap-4 py-3 text-sm border-b ${colors.borderLight}`}>
                <div>
                  <div className={`${colors.textMuted} text-xs mb-1`}>持仓市值</div>
                  <div>{usTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className={`${colors.textMuted} text-xs mb-1`}>持仓盈亏</div>
                  <div className={usProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {usProfitLoss >= 0 ? '+' : ''}{usProfitLoss.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${colors.textMuted} text-xs mb-1`}>当日盈亏</div>
                  <div className={usTodayPL >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {usTodayPL >= 0 ? '+' : ''}{usTodayPL.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-4 gap-2 py-2 text-xs ${colors.textMuted}`}>
                <div>名称/代码</div>
                <div className="text-right">市值/数量</div>
                <div className="text-right">现价/成本</div>
                <div className="text-right">当日盈亏</div>
              </div>

              {usPositions.map(position => (
                <Link
                  key={position.symbol}
                  href={`/stock/${position.market}/${position.symbol}`}
                  className={`grid grid-cols-4 gap-2 py-3 border-t ${colors.borderLight} ${colors.hover} transition`}
                >
                  <div>
                    <div className="font-medium">{position.name}</div>
                    <div className={`text-xs ${colors.textMuted} flex items-center gap-1`}>
                      {position.symbol}
                      <span className="text-yellow-500">🏆</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className={`text-xs ${colors.textMuted}`}>{position.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div>{position.currentPrice.toFixed(3)}</div>
                    <div className={`text-xs ${colors.textMuted}`}>{position.costPrice.toFixed(3)}</div>
                  </div>
                  <div className="text-right">
                    <div className={position.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {position.profitLoss >= 0 ? '+' : ''}{position.profitLoss.toFixed(2)}
                    </div>
                    <div className={`text-xs ${position.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>

        {/* 港股持仓 */}
        <div className={`px-4 py-3 border-t ${colors.border}`}>
          <button 
            onClick={() => setExpandedMarket(expandedMarket === 'HK' ? null : 'HK')}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇭🇰</span>
              <span className="font-medium">港股</span>
              <span className="font-bold">{hkTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <span className={colors.textMuted}>{expandedMarket === 'HK' ? '∧' : '∨'}</span>
          </button>

          {expandedMarket === 'HK' && (
            <>
              <div className={`grid grid-cols-3 gap-4 py-3 text-sm border-b ${colors.borderLight}`}>
                <div>
                  <div className={`${colors.textMuted} text-xs mb-1`}>持仓市值</div>
                  <div>{hkTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className={`${colors.textMuted} text-xs mb-1`}>持仓盈亏</div>
                  <div className={hkProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {hkProfitLoss >= 0 ? '+' : ''}{hkProfitLoss.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${colors.textMuted} text-xs mb-1`}>当日盈亏</div>
                  <div className={hkTodayPL >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {hkTodayPL >= 0 ? '+' : ''}{hkTodayPL.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-4 gap-2 py-2 text-xs ${colors.textMuted}`}>
                <div>名称/代码</div>
                <div className="text-right">市值/数量</div>
                <div className="text-right">现价/成本</div>
                <div className="text-right">当日盈亏</div>
              </div>

              {hkPositions.map(position => (
                <Link
                  key={position.symbol}
                  href={`/stock/${position.market}/${position.symbol}`}
                  className={`grid grid-cols-4 gap-2 py-3 border-t ${colors.borderLight} ${colors.hover} transition`}
                >
                  <div>
                    <div className="font-medium">{position.name}</div>
                    <div className={`text-xs ${colors.textMuted}`}>{position.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div>{position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className={`text-xs ${colors.textMuted}`}>{position.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div>{position.currentPrice.toFixed(3)}</div>
                    <div className={`text-xs ${colors.textMuted}`}>{position.costPrice.toFixed(3)}</div>
                  </div>
                  <div className="text-right">
                    <div className={position.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {position.profitLoss >= 0 ? '+' : ''}{position.profitLoss.toFixed(2)}
                    </div>
                    <div className={`text-xs ${position.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>

        {/* 编辑按钮 */}
        <div className="flex justify-center py-6">
          <button className={`flex items-center gap-2 px-6 py-2 border ${colors.borderLight} rounded-full ${colors.textSecondary} ${colors.hover} transition`}>
            <span>✏️</span>
            <span>编辑</span>
          </button>
        </div>
      </div>

      <BottomNav active="positions" />
    </main>
  );
}
