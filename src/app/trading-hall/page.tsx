'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import { MOCK_POSITIONS } from '@/lib/mockData';

export default function TradingHallPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [stockCode, setStockCode] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // 计算预估金额
  const estimatedAmount = price && quantity ? (parseFloat(price) * parseInt(quantity)).toFixed(2) : '0.00';

  // 获取选中股票信息
  const selectedPosition = selectedStock ? MOCK_POSITIONS.find(p => p.symbol === selectedStock) : null;

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/positions" className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-medium">请选择股票</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <button className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 账户选择 */}
        <div className={`px-4 py-3 flex items-center justify-between border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs">💰</span>
            <span className="font-medium">模拟炒股 (LBPT10078568)</span>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>

        {/* 股票代码输入 */}
        <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center">
            <span className={`w-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>股票</span>
            <div className={`flex-1 flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value.toUpperCase())}
                placeholder="输入股票代码，如 AAPL、700.HK"
                className={`flex-1 bg-transparent outline-none text-sm ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
            </div>
          </div>
        </div>

        {/* 订单类型 */}
        <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>类型</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`flex-1 ml-4 py-2 text-center rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <span className="font-medium">{orderType === 'limit' ? '限价单' : '市价单'}</span>
            </div>
          </div>
        </div>

        {/* 买卖方向 */}
        <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center">
            <span className={`w-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>方向</span>
            <div className="flex-1 flex">
              <button
                onClick={() => setDirection('buy')}
                className={`flex-1 py-2 rounded-l-full font-medium transition ${
                  direction === 'buy'
                    ? 'bg-orange-500 text-white'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                买入
              </button>
              <button
                onClick={() => setDirection('sell')}
                className={`flex-1 py-2 rounded-r-full font-medium transition ${
                  direction === 'sell'
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                卖出
              </button>
            </div>
          </div>
        </div>

        {/* 价格输入 */}
        <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center">
            <span className={`w-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>价格</span>
            <div className="flex-1 flex items-center">
              <button 
                onClick={() => setPrice(p => String(Math.max(0, parseFloat(p || '0') - 0.01).toFixed(2)))}
                className={`px-3 py-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}
              >
                −
              </button>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="请输入价格"
                className={`flex-1 text-center py-2 bg-transparent outline-none ${theme === 'dark' ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <button 
                onClick={() => setPrice(p => String((parseFloat(p || '0') + 0.01).toFixed(2)))}
                className={`px-3 py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                +
              </button>
              <button className={`px-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 数量输入 */}
        <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center">
            <div className="w-16 flex items-center gap-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>数量</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <div className="flex-1 flex items-center">
              <button 
                onClick={() => setQuantity(q => String(Math.max(0, parseInt(q || '0') - 1)))}
                className={`px-3 py-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}
              >
                −
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="请输入数量"
                className={`flex-1 text-center py-2 bg-transparent outline-none ${theme === 'dark' ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <button 
                onClick={() => setQuantity(q => String(parseInt(q || '0') + 1))}
                className={`px-3 py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                +
              </button>
              <button className={`px-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 可买信息 */}
        <div className={`px-4 py-3 flex justify-between text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>现金可买 --</span>
          <span>融资最大可买 --</span>
        </div>

        {/* 预估金额 */}
        <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>预估金额</span>
            <span className="text-2xl font-bold">{estimatedAmount}</span>
          </div>
          <div className="flex justify-end mt-1">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>预估成交后持仓成本 --</span>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            className={`flex-1 py-3 rounded-full font-medium transition ${
              direction === 'buy'
                ? 'bg-orange-500 text-white'
                : 'bg-blue-500 text-white'
            } ${!price || !quantity ? 'opacity-50' : ''}`}
            disabled={!price || !quantity}
          >
            模拟{direction === 'buy' ? '买入' : '卖出'}
          </button>
          <button className="flex flex-col items-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>预览</span>
          </button>
        </div>

        {/* 底部持仓区域 */}
        <div className={`mt-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-t-3xl`}>
          {/* 持仓/当日订单 Tab */}
          <div className="px-4 pt-4 flex items-center gap-6">
            <button
              onClick={() => setActiveTab('positions')}
              className={`font-medium ${activeTab === 'positions' ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}
            >
              持仓
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-sm ${activeTab === 'orders' ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}
            >
              当日订单 (0/0)
            </button>
          </div>

          {/* 表头 */}
          <div className={`grid grid-cols-4 gap-2 px-4 py-3 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <div>名称/代码</div>
            <div className="text-right">市值/数量</div>
            <div className="text-right">现价/成本</div>
            <div className="text-right flex items-center justify-end gap-1">
              持仓盈亏
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* 持仓列表 */}
          <div className="pb-20">
            {MOCK_POSITIONS.map(position => (
              <button
                key={position.symbol}
                onClick={() => setSelectedStock(position.symbol)}
                className={`w-full grid grid-cols-4 gap-2 px-4 py-3 text-left transition ${
                  selectedStock === position.symbol 
                    ? (theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50')
                    : ''
                } ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'}`}
              >
                <div>
                  <div className="font-medium">{position.name}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="text-blue-500">{position.market}</span> {position.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div>{position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{position.quantity}</div>
                </div>
                <div className="text-right">
                  <div>{position.currentPrice.toFixed(3)}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{position.costPrice.toFixed(3)}</div>
                </div>
                <div className="text-right">
                  <div className={position.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {position.profitLoss >= 0 ? '+' : ''}{position.profitLoss.toFixed(2)}
                  </div>
                  <div className={`text-xs ${position.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
