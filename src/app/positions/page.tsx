'use client';

import Link from 'next/link';
import { MOCK_POSITIONS, MOCK_ACCOUNT } from '@/lib/mockData';

export default function PositionsPage() {
  const totalProfitLoss = MOCK_POSITIONS.reduce((sum, p) => sum + p.profitLoss, 0);
  const totalMarketValue = MOCK_POSITIONS.reduce((sum, p) => sum + p.marketValue, 0);

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="mr-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">持仓</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 持仓汇总 */}
        <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 m-4 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">持仓市值</div>
              <div className="text-2xl font-bold">{totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">持仓盈亏</div>
              <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* 持仓列表 */}
        <div className="px-4 mb-2">
          <div className="text-sm text-gray-400">共 {MOCK_POSITIONS.length} 只股票</div>
        </div>

        <div className="divide-y divide-gray-800/50">
          {MOCK_POSITIONS.map(position => {
            const isUp = position.profitLoss >= 0;
            return (
              <Link
                key={position.symbol}
                href={`/stock/${position.market}/${position.symbol}`}
                className="block px-4 py-4 hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{position.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${position.market === 'HK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {position.market}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{position.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{position.currentPrice.toFixed(2)}</div>
                    <div className={`text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">持仓</div>
                    <div>{position.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">可卖</div>
                    <div>{position.availableQuantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">成本</div>
                    <div>{position.costPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">盈亏</div>
                    <div className={isUp ? 'text-green-500' : 'text-red-500'}>
                      {isUp ? '+' : ''}{position.profitLoss.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {MOCK_POSITIONS.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">📭</div>
            <div>暂无持仓</div>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="max-w-lg mx-auto flex">
          {[
            { icon: '🏠', label: '首页', href: '/', active: false },
            { icon: '📊', label: '行情', href: '/market', active: false },
            { icon: '💹', label: '交易', href: '/trade', active: false },
            { icon: '💼', label: '持仓', href: '/positions', active: true },
            { icon: '👤', label: '我的', href: '/account', active: false },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 ${item.active ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
