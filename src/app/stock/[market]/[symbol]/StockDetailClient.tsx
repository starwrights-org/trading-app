'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStock, submitOrder, MOCK_STOCKS } from '@/lib/mockData';
import { useTheme, themeColors } from '@/lib/theme';

// 从完整股票数据获取基本信息
interface StockBasicInfo {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  alias?: string;
}

// 生成随机价格数据（用于没有实时数据的股票）
function generateMockPrice(symbol: string): {
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
} {
  // 用 symbol 作为 seed 生成固定的伪随机数
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) {
    seed = ((seed << 5) - seed) + symbol.charCodeAt(i);
    seed = seed & seed;
  }
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // 根据 symbol 特征生成合理的价格
  let basePrice = 50 + random() * 450; // 50-500
  if (symbol.startsWith('0')) {
    // 港股
    basePrice = 5 + random() * 195; // 5-200
  }
  
  const changePercent = (random() - 0.5) * 6; // -3% ~ +3%
  const change = basePrice * changePercent / 100;
  const prevClose = basePrice - change;
  const high = basePrice * (1 + random() * 0.02);
  const low = basePrice * (1 - random() * 0.02);
  
  return {
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    open: parseFloat(prevClose.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    prevClose: parseFloat(prevClose.toFixed(2)),
    volume: Math.floor(random() * 50000000),
  };
}

export default function StockDetailClient({ market, symbol }: { market: string; symbol: string }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [stockInfo, setStockInfo] = useState<StockBasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'news'>('chart');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // 先尝试从 MOCK_STOCKS 获取完整数据
  const mockStock = getStock(symbol);
  
  // 加载股票基本信息
  useEffect(() => {
    if (mockStock) {
      setStockInfo({
        symbol: mockStock.symbol,
        name: mockStock.name,
        market: mockStock.market as 'US' | 'HK',
      });
      setLoading(false);
      return;
    }
    
    // 从完整数据库加载
    fetch('/trading-app/data/stocks.json?v=20260321v4')
      .then(res => res.json())
      .then((data: StockBasicInfo[]) => {
        const found = data.find(s => s.symbol === symbol);
        if (found) {
          setStockInfo(found);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('加载股票数据失败:', err);
        setLoading(false);
      });
  }, [symbol, mockStock]);

  if (loading) {
    return (
      <div className={`min-h-screen ${colors.bg} ${colors.text} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className={`mt-2 ${colors.textMuted}`}>加载中...</p>
        </div>
      </div>
    );
  }

  if (!stockInfo && !mockStock) {
    return (
      <div className={`min-h-screen ${colors.bg} ${colors.text} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <div className="text-xl">找不到股票 {symbol}</div>
          <Link href="/search" className="text-blue-500 mt-4 inline-block">返回搜索</Link>
        </div>
      </div>
    );
  }

  // 使用真实数据或生成模拟数据
  const priceData = mockStock ? {
    price: mockStock.price,
    change: mockStock.change,
    changePercent: mockStock.changePercent,
    open: mockStock.open,
    high: mockStock.high,
    low: mockStock.low,
    prevClose: mockStock.prevClose,
    volume: mockStock.volume,
    pe: mockStock.pe,
  } : generateMockPrice(symbol);

  const stock = {
    symbol,
    name: stockInfo?.name || mockStock?.name || symbol,
    nameEn: mockStock?.nameEn || stockInfo?.alias || '',
    market: market as 'HK' | 'US',
    ...priceData,
  };

  const isUp = stock.change >= 0;

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-24`}>
      {/* Header */}
      <div className={`${colors.bg} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/search" className={`mr-4 ${colors.textSecondary} hover:${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">{stock.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${market === 'HK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {market === 'HK' ? '港' : '美'}
              </span>
            </div>
            <div className={`text-sm ${colors.textMuted}`}>{stock.symbol}</div>
          </div>
          <button className={`${colors.textSecondary} hover:text-yellow-500`}>
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
          
          {/* 模拟数据提示 */}
          {!mockStock && (
            <div className={`text-xs ${colors.textMuted} mt-1`}>
              📊 模拟数据（接入实时行情后显示真实价格）
            </div>
          )}
          
          {/* 详细数据 */}
          <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <div className={colors.textMuted}>今开</div>
              <div className={colors.text}>{stock.open?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className={colors.textMuted}>最高</div>
              <div className="text-red-400">{stock.high?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className={colors.textMuted}>最低</div>
              <div className="text-green-400">{stock.low?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className={colors.textMuted}>昨收</div>
              <div className={colors.text}>{stock.prevClose?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className={colors.textMuted}>成交量</div>
              <div className={colors.text}>{stock.volume ? (stock.volume / 10000).toFixed(0) + '万' : '-'}</div>
            </div>
            <div>
              <div className={colors.textMuted}>市盈率</div>
              <div className={colors.text}>{(stock as any).pe?.toFixed(2) || '-'}</div>
            </div>
            <div>
              <div className={colors.textMuted}>52周高</div>
              <div className={colors.text}>-</div>
            </div>
            <div>
              <div className={colors.textMuted}>52周低</div>
              <div className={colors.text}>-</div>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className={`flex border-b ${colors.border} px-4`}>
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
                  : `border-transparent ${colors.textSecondary} hover:${colors.text}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 图表区域 */}
        {activeTab === 'chart' && (
          <div className="p-4">
            <div className={`${colors.bgCard} rounded-xl p-4 h-64 flex items-center justify-center`}>
              <div className={`text-center ${colors.textMuted}`}>
                <div className="text-4xl mb-2">📊</div>
                <div>K线图表</div>
                <div className="text-xs mt-1">（集成 TradingView / ECharts）</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              {['分时', '5分', '15分', '30分', '60分', '日K', '周K', '月K'].map(period => (
                <button key={period} className={`px-3 py-1.5 text-xs ${colors.bgSecondary} rounded ${colors.hover} transition`}>
                  {period}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className={`p-4 text-sm ${colors.textSecondary}`}>
            <div className={`${colors.bgCard} rounded-xl p-4`}>
              <h3 className={`font-medium ${colors.text} mb-2`}>公司简介</h3>
              <p>{stock.nameEn || stock.name} ({stock.symbol}) 是一家在{market === 'HK' ? '香港' : '美国'}上市的公司。</p>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className={`p-4 text-sm ${colors.textSecondary}`}>
            <div className="text-center py-8">暂无相关资讯</div>
          </div>
        )}

        {/* 买卖盘 */}
        <div className="p-4">
          <div className={`${colors.bgCard} rounded-xl p-4`}>
            <div className={`text-sm ${colors.textSecondary} mb-3`}>买卖盘</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                {[5, 4, 3, 2, 1].map(i => (
                  <div key={`ask${i}`} className="flex justify-between py-1">
                    <span className={colors.textMuted}>卖{i}</span>
                    <span className="text-red-400">{(stock.price + i * 0.2).toFixed(2)}</span>
                    <span className={colors.textMuted}>{Math.floor(Math.random() * 1000)}</span>
                  </div>
                ))}
              </div>
              <div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={`bid${i}`} className="flex justify-between py-1">
                    <span className={colors.textMuted}>买{i}</span>
                    <span className="text-green-400">{(stock.price - i * 0.2).toFixed(2)}</span>
                    <span className={colors.textMuted}>{Math.floor(Math.random() * 1000)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部交易按钮 */}
      <div className={`fixed bottom-0 left-0 right-0 ${colors.bg} border-t ${colors.border} p-4`}>
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
          theme={theme}
          colors={colors}
        />
      )}
    </main>
  );
}

// 交易弹窗组件
function TradeModal({ stock, type, onClose, theme, colors }: { 
  stock: any; 
  type: 'buy' | 'sell'; 
  onClose: () => void;
  theme: string;
  colors: typeof themeColors.dark;
}) {
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
      <div className={`w-full ${colors.bg} rounded-t-3xl p-6 max-w-lg mx-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${colors.text}`}>
            {type === 'buy' ? '买入' : '卖出'} {stock.name}
          </h2>
          <button onClick={onClose} className={`${colors.textSecondary} hover:${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className={`text-sm ${colors.textSecondary} mb-2 block`}>订单类型</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                orderType === 'limit' ? 'bg-blue-600 text-white' : `${colors.bgSecondary} ${colors.textSecondary}`
              }`}
            >
              限价单
            </button>
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                orderType === 'market' ? 'bg-blue-600 text-white' : `${colors.bgSecondary} ${colors.textSecondary}`
              }`}
            >
              市价单
            </button>
          </div>
        </div>

        {orderType === 'limit' && (
          <div className="mb-4">
            <label className={`text-sm ${colors.textSecondary} mb-2 block`}>委托价格</label>
            <div className={`flex items-center ${colors.bgSecondary} rounded-lg`}>
              <button
                onClick={() => setPrice((parseFloat(price) - 0.1).toFixed(2))}
                className={`px-4 py-3 text-xl ${colors.textSecondary} hover:${colors.text}`}
              >
                −
              </button>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`flex-1 bg-transparent text-center text-xl font-medium outline-none ${colors.text}`}
              />
              <button
                onClick={() => setPrice((parseFloat(price) + 0.1).toFixed(2))}
                className={`px-4 py-3 text-xl ${colors.textSecondary} hover:${colors.text}`}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className={`text-sm ${colors.textSecondary} mb-2 block`}>委托数量</label>
          <div className={`flex items-center ${colors.bgSecondary} rounded-lg`}>
            <button
              onClick={() => setQuantity(String(Math.max(0, parseInt(quantity || '0') - 100)))}
              className={`px-4 py-3 text-xl ${colors.textSecondary} hover:${colors.text}`}
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`flex-1 bg-transparent text-center text-xl font-medium outline-none ${colors.text}`}
            />
            <button
              onClick={() => setQuantity(String(parseInt(quantity || '0') + 100))}
              className={`px-4 py-3 text-xl ${colors.textSecondary} hover:${colors.text}`}
            >
              +
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            {['100', '500', '1000', '全仓'].map(q => (
              <button
                key={q}
                onClick={() => q !== '全仓' && setQuantity(q)}
                className={`flex-1 py-1.5 text-xs ${colors.bgSecondary} rounded ${colors.hover} transition`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className={`${colors.bgCard} rounded-lg p-4 mb-6`}>
          <div className="flex justify-between text-sm">
            <span className={colors.textSecondary}>预估金额</span>
            <span className={`font-medium ${colors.text}`}>{stock.market === 'HK' ? 'HKD' : 'USD'} {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

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
