'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_STOCKS, MOCK_ACCOUNT, getTopGainers, getTopLosers } from '@/lib/mockData';
import { Stock } from '@/lib/types';

// 股票行组件
function StockRow({ stock, showMarket = false }: { stock: Stock; showMarket?: boolean }) {
  const isUp = stock.change >= 0;
  return (
    <Link href={`/stock/${stock.market}/${stock.symbol}`} className="flex items-center justify-between py-3 px-4 hover:bg-gray-800/50 transition">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{stock.name}</span>
          {showMarket && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${stock.market === 'HK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {stock.market}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{stock.symbol}</div>
      </div>
      <div className="text-right">
        <div className="font-medium text-white">{stock.price.toFixed(2)}</div>
        <div className={`text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%)
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'hk' | 'us'>('watchlist');
  const watchlist = MOCK_STOCKS.slice(0, 6);
  const hkStocks = MOCK_STOCKS.filter(s => s.market === 'HK');
  const usStocks = MOCK_STOCKS.filter(s => s.market === 'US');

  const displayStocks = activeTab === 'watchlist' ? watchlist : activeTab === 'hk' ? hkStocks : usStocks;

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">交易</h1>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 账户概览 */}
        <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 m-4 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">总资产 (HKD)</div>
          <div className="text-3xl font-bold mb-2">{MOCK_ACCOUNT.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-400">今日盈亏</span>
              <span className={`ml-2 ${MOCK_ACCOUNT.todayProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {MOCK_ACCOUNT.todayProfitLoss >= 0 ? '+' : ''}{MOCK_ACCOUNT.todayProfitLoss.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">可用资金</span>
              <span className="ml-2 text-white">{MOCK_ACCOUNT.cashBalance.toLocaleString()}</span>
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
            <Link key={item.label} href={item.href} className="flex flex-col items-center py-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition">
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 涨跌榜 */}
        <div className="grid grid-cols-2 gap-4 px-4 mb-4">
          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="text-sm text-gray-400 mb-2">🔥 涨幅榜</div>
            {getTopGainers().slice(0, 3).map(stock => (
              <Link key={stock.symbol} href={`/stock/${stock.market}/${stock.symbol}`} className="flex justify-between py-1.5 text-sm hover:text-green-400">
                <span className="text-gray-300">{stock.name}</span>
                <span className="text-green-500">+{stock.changePercent.toFixed(2)}%</span>
              </Link>
            ))}
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="text-sm text-gray-400 mb-2">📉 跌幅榜</div>
            {getTopLosers().slice(0, 3).map(stock => (
              <Link key={stock.symbol} href={`/stock/${stock.market}/${stock.symbol}`} className="flex justify-between py-1.5 text-sm hover:text-red-400">
                <span className="text-gray-300">{stock.name}</span>
                <span className="text-red-500">{stock.changePercent.toFixed(2)}%</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 自选/港股/美股 Tab */}
        <div className="flex border-b border-gray-800 px-4">
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
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 股票列表 */}
        <div className="divide-y divide-gray-800/50">
          {displayStocks.map(stock => (
            <StockRow key={stock.symbol} stock={stock} showMarket={activeTab === 'watchlist'} />
          ))}
        </div>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="max-w-lg mx-auto flex">
          {[
            { icon: '🏠', label: '首页', href: '/', active: true },
            { icon: '📊', label: '行情', href: '/market', active: false },
            { icon: '💹', label: '交易', href: '/trade', active: false },
            { icon: '💼', label: '持仓', href: '/positions', active: false },
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
