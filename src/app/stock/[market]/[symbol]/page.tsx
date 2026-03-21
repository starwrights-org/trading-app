'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { getStock, submitOrder, generateMockKline } from '@/lib/mockData';
import { ORDER_TYPES } from '@/lib/types';

export default function StockDetailPage({ params }: { params: Promise<{ market: string; symbol: string }> }) {
  const { market, symbol } = use(params);
  const stock = getStock(symbol);
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'news'>('chart');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <div className="text-xl">找不到股票 {symbol}</div>
          <Link href="/" className="text-blue-500 mt-4 inline-block">返回首页</Link>
        </div>
      </div>
    );
  }

  const isUp = stock.change >= 0;
  const klines = generateMockKline(30);

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-24">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="mr-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">{stock.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${market === 'HK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {market}
              </span>
            </div>
            <div className="text-sm text-gray-500">{stock.symbol}</div>
          </div>
          <button className="text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 价格信息 */}
        <div className="p-4">
          <div className="flex items-baseline gap-3">
            <span className={`text-4xl font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
              {stock.price.toFixed(2)}
            </span>
            <span className={`text-lg ${isUp ? 'text-green-500' : 'text-red-500'}`}>
              {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
          
          {/* 详细数据 */}
          <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <div className="text-gray-500">今开</div>
              <div>{stock.open?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">最高</div>
              <div className="text-red-400">{stock.high?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">最低</div>
              <div className="text-green-400">{stock.low?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">昨收</div>
              <div>{stock.prevClose?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">成交量</div>
              <div>{stock.volume ? (stock.volume / 10000).toFixed(0) + '万' : '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">市盈率</div>
              <div>{stock.pe?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">52周高</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-gray-500">52周低</div>
              <div>-</div>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-800 px-4">
          {[
            { key: 'chart', label: '图表' },
            { key: 'info', label: '简况' },
            { key: 'news', label: '资讯' },
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

        {/* 图表区域 */}
        {activeTab === 'chart' && (
          <div className="p-4">
            {/* 简单的K线展示（实际应用中用 TradingView 或 ECharts） */}
            <div className="bg-gray-800/50 rounded-xl p-4 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <div>K线图表</div>
                <div className="text-xs mt-1">（集成 TradingView / ECharts）</div>
              </div>
            </div>
            
            {/* 时间周期选择 */}
            <div className="flex gap-2 mt-4">
              {['分时', '5分', '15分', '30分', '60分', '日K', '周K', '月K'].map(period => (
                <button key={period} className="px-3 py-1.5 text-xs bg-gray-800 rounded hover:bg-gray-700 transition">
                  {period}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="p-4 text-sm text-gray-400">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-medium text-white mb-2">公司简介</h3>
              <p>{stock.nameEn} ({stock.symbol}) 是一家在{market === 'HK' ? '香港' : '美国'}上市的公司。</p>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="p-4 text-sm text-gray-400">
            <div className="text-center py-8">暂无相关资讯</div>
          </div>
        )}

        {/* 买卖盘 */}
        <div className="p-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-3">买卖盘</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* 卖盘 */}
              <div>
                {[5, 4, 3, 2, 1].map(i => (
                  <div key={`ask${i}`} className="flex justify-between py-1">
                    <span className="text-gray-500">卖{i}</span>
                    <span className="text-red-400">{(stock.price + i * 0.2).toFixed(2)}</span>
                    <span className="text-gray-500">{Math.floor(Math.random() * 1000)}</span>
                  </div>
                ))}
              </div>
              {/* 买盘 */}
              <div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={`bid${i}`} className="flex justify-between py-1">
                    <span className="text-gray-500">买{i}</span>
                    <span className="text-green-400">{(stock.price - i * 0.2).toFixed(2)}</span>
                    <span className="text-gray-500">{Math.floor(Math.random() * 1000)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部交易按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-lg mx-auto flex gap-4">
          <button
            onClick={() => { setTradeType('buy'); setShowTradeModal(true); }}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition"
          >
            买入
          </button>
          <button
            onClick={() => { setTradeType('sell'); setShowTradeModal(true); }}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition"
          >
            卖出
          </button>
        </div>
      </div>

      {/* 交易弹窗 */}
      {showTradeModal && (
        <TradeModal
          stock={stock}
          type={tradeType}
          onClose={() => setShowTradeModal(false)}
        />
      )}
    </main>
  );
}

// 交易弹窗组件
function TradeModal({ stock, type, onClose }: { stock: any; type: 'buy' | 'sell'; onClose: () => void }) {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState(stock.price.toFixed(2));
  const [quantity, setQuantity] = useState('100');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const result = await submitOrder({
      symbol: stock.symbol,
      side: type,
      orderType,
      price: orderType === 'limit' ? parseFloat(price) : undefined,
      quantity: parseInt(quantity),
    });

    setSubmitting(false);

    if (result.success) {
      alert(`✅ ${result.message}\n订单号: ${result.orderId}`);
      onClose();
    } else {
      alert(`❌ 下单失败: ${result.message}`);
    }
  };

  const total = parseFloat(price) * parseInt(quantity || '0');

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
      <div className="w-full bg-gray-900 rounded-t-3xl p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {type === 'buy' ? '买入' : '卖出'} {stock.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 订单类型 */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">订单类型</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                orderType === 'limit' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              限价单
            </button>
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                orderType === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              市价单
            </button>
          </div>
        </div>

        {/* 价格 */}
        {orderType === 'limit' && (
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">委托价格</label>
            <div className="flex items-center bg-gray-800 rounded-lg">
              <button
                onClick={() => setPrice((parseFloat(price) - 0.1).toFixed(2))}
                className="px-4 py-3 text-xl text-gray-400 hover:text-white"
              >
                −
              </button>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent text-center text-xl font-medium outline-none"
              />
              <button
                onClick={() => setPrice((parseFloat(price) + 0.1).toFixed(2))}
                className="px-4 py-3 text-xl text-gray-400 hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* 数量 */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">委托数量</label>
          <div className="flex items-center bg-gray-800 rounded-lg">
            <button
              onClick={() => setQuantity(String(Math.max(0, parseInt(quantity || '0') - 100)))}
              className="px-4 py-3 text-xl text-gray-400 hover:text-white"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 bg-transparent text-center text-xl font-medium outline-none"
            />
            <button
              onClick={() => setQuantity(String(parseInt(quantity || '0') + 100))}
              className="px-4 py-3 text-xl text-gray-400 hover:text-white"
            >
              +
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            {['100', '500', '1000', '全仓'].map(q => (
              <button
                key={q}
                onClick={() => q !== '全仓' && setQuantity(q)}
                className="flex-1 py-1.5 text-xs bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 预估金额 */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">预估金额</span>
            <span className="font-medium">{stock.market === 'HK' ? 'HKD' : 'USD'} {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-4 rounded-xl font-medium text-lg transition ${
            type === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50`}
        >
          {submitting ? '提交中...' : `确认${type === 'buy' ? '买入' : '卖出'}`}
        </button>
      </div>
    </div>
  );
}
