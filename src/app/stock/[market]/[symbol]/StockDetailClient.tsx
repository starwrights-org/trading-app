'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStock, submitOrder, MOCK_STOCKS } from '@/lib/mockData';
import { useTheme, themeColors } from '@/lib/theme';

// 动态加载 K 线图表组件（避免 SSR 问题）
const KlineChart = dynamic(() => import('@/components/KlineChart'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
    </div>
  )
});

// K 线数据类型
interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// K 线图表包装器
function KlineChartWrapper({ symbol, market, theme }: { symbol: string; market: string; theme: 'dark' | 'light' }) {
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colors = themeColors[theme];

  useEffect(() => {
    // 构造文件名: 00883.HK -> 00883_HK.json, AAPL.US -> AAPL_US.json
    const suffix = market === 'HK' ? 'HK' : 'US';
    const filename = `${symbol}_${suffix}.json`;
    
    fetch(`/trading-app/data/kline/${filename}?v=20260321`)
      .then(res => {
        if (!res.ok) throw new Error('K线数据不存在');
        return res.json();
      })
      .then((data: KlineData[]) => {
        setKlineData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载K线数据失败:', err);
        setError('暂无K线数据');
        setLoading(false);
      });
  }, [symbol, market]);

  if (loading) {
    return (
      <div className={`${colors.bgCard} rounded-lg p-8`}>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || klineData.length === 0) {
    return (
      <div className={`${colors.bgCard} rounded-lg p-8 text-center`}>
        <div className="text-4xl mb-2">📊</div>
        <div className={colors.textMuted}>{error || '暂无K线数据'}</div>
        <div className={`text-sm ${colors.textMuted} mt-1`}>热门股票已预加载K线</div>
      </div>
    );
  }

  return (
    <div className={`${colors.bgCard} rounded-lg overflow-hidden`}>
      <KlineChart data={klineData} symbol={symbol} theme={theme} />
      <div className={`text-xs ${colors.textMuted} text-center py-2`}>
        📊 长桥 API 日K线 | 双指缩放
      </div>
    </div>
  );
}

// 窝轮/牛熊证数据类型
interface WarrantData {
  symbol: string;
  name: string;
  lastDone: number;
  changePercent: number;
  volume: number;
  strikePrice: number;
  expiryDate: string;
  type: 'call' | 'put' | 'bull' | 'bear' | 'other';
  premium?: number;
  leverage?: number;
}

// 窝轮列表组件
function WarrantListWrapper({ symbol, theme, colors }: { symbol: string; theme: 'dark' | 'light'; colors: typeof themeColors.dark }) {
  const [warrants, setWarrants] = useState<WarrantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'call' | 'put' | 'bull' | 'bear'>('all');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // 从预生成的 JSON 加载窝轮数据
    fetch(`/trading-app/data/warrants/${symbol}.json?v=20260321`)
      .then(res => {
        if (!res.ok) throw new Error('暂无窝轮数据');
        return res.json();
      })
      .then((data: WarrantData[]) => {
        setWarrants(data);
        setTotalCount(data.length);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载窝轮数据失败:', err);
        setError('暂无窝轮数据');
        setLoading(false);
      });
  }, [symbol]);

  const filteredWarrants = filter === 'all' 
    ? warrants 
    : warrants.filter(w => w.type === filter);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'call': return '认购';
      case 'put': return '认沽';
      case 'bull': return '牛证';
      case 'bear': return '熊证';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-green-500/20 text-green-400';
      case 'put': return 'bg-red-500/20 text-red-400';
      case 'bull': return 'bg-orange-500/20 text-orange-400';
      case 'bear': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`${colors.bgCard} rounded-lg p-8`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 筛选按钮 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'call', 'put', 'bull', 'bear'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === f
                ? 'bg-orange-500 text-white'
                : `${colors.bgCard} ${colors.textMuted}`
            }`}
          >
            {f === 'all' ? `全部(${totalCount})` : getTypeLabel(f)}
          </button>
        ))}
      </div>

      {/* 窝轮列表 */}
      <div className={`${colors.bgCard} rounded-lg divide-y ${colors.border}`}>
        {error ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">📋</div>
            <div className={colors.textMuted}>{error}</div>
          </div>
        ) : filteredWarrants.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">📋</div>
            <div className={colors.textMuted}>暂无数据</div>
          </div>
        ) : (
          filteredWarrants.map((w) => (
            <Link 
              key={w.symbol} 
              href={`/stock/HK/${w.symbol}/`}
              className={`block p-3 ${colors.hover} transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{w.symbol}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeColor(w.type)}`}>
                      {getTypeLabel(w.type)}
                    </span>
                  </div>
                  <div className={`text-xs ${colors.textMuted} mt-1`}>
                    {w.expiryDate} | 溢价: {w.premium || '-'}% | 杠杆: {w.leverage || '-'}x
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{w.lastDone.toFixed(3)}</div>
                  <div className={`text-xs ${w.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {w.changePercent >= 0 ? '+' : ''}{w.changePercent.toFixed(1)}%
                  </div>
                  <div className={`text-xs ${colors.textMuted}`}>
                    {(w.volume / 100000000).toFixed(1)}亿
                  </div>
                </div>
                {/* 右箭头 */}
                <svg className={`w-4 h-4 ml-2 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 提示 */}
      {totalCount > 0 && (
        <div className={`text-xs ${colors.textMuted} text-center`}>
          📊 长桥 API 数据 | 显示前 {filteredWarrants.length} 只 | 按成交量排序
        </div>
      )}
    </div>
  );
}

// 股票完整信息（包含价格）
interface StockFullInfo {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  alias?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
}

// 生成随机价格数据（仅作为后备方案）
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
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) {
    seed = ((seed << 5) - seed) + symbol.charCodeAt(i);
    seed = seed & seed;
  }
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  let basePrice = 50 + random() * 450;
  if (symbol.startsWith('0')) {
    basePrice = 5 + random() * 195;
  }
  
  const changePercent = (random() - 0.5) * 6;
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
  
  const [stockInfo, setStockInfo] = useState<StockFullInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'news' | 'warrant'>('chart');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // 先尝试从 MOCK_STOCKS 获取完整数据
  const mockStock = getStock(symbol);
  
  // 加载股票完整信息（包含价格）
  useEffect(() => {
    if (mockStock) {
      setStockInfo({
        symbol: mockStock.symbol,
        name: mockStock.name,
        market: mockStock.market as 'US' | 'HK',
        price: mockStock.price,
        change: mockStock.change,
        changePercent: mockStock.changePercent,
        open: mockStock.open,
        high: mockStock.high,
        low: mockStock.low,
        prevClose: mockStock.prevClose,
        volume: mockStock.volume,
      });
      setIsRealData(true);
      setLoading(false);
      return;
    }
    
    // 从完整数据库加载（包含长桥 API 更新的价格）
    fetch('/trading-app/data/stocks.json?v=20260321v5')
      .then(res => res.json())
      .then((data: StockFullInfo[]) => {
        const found = data.find(s => s.symbol === symbol);
        if (found) {
          setStockInfo(found);
          // 检查是否有真实价格数据
          setIsRealData(found.price !== undefined && found.price > 0);
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

  // 优先使用 stocks.json 中的真实价格数据，没有则生成模拟数据
  const hasRealPrice = stockInfo && stockInfo.price !== undefined && stockInfo.price > 0;
  
  const priceData = hasRealPrice ? {
    price: stockInfo!.price!,
    change: stockInfo!.change || 0,
    changePercent: stockInfo!.changePercent || 0,
    open: stockInfo!.open || stockInfo!.price!,
    high: stockInfo!.high || stockInfo!.price!,
    low: stockInfo!.low || stockInfo!.price!,
    prevClose: stockInfo!.prevClose || stockInfo!.price!,
    volume: stockInfo!.volume || 0,
    pe: undefined as number | undefined,
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
          {/* 数据来源标识 */}
          {!hasRealPrice && (
            <div className={`text-xs ${colors.textMuted} mt-1 flex items-center gap-1`}>
              <span>🏭</span>
              <span>模拟数据（接入实时行情后显示真实价格）</span>
            </div>
          )}
          {hasRealPrice && (
            <div className={`text-xs ${colors.textMuted} mt-1 flex items-center gap-1`}>
              <span>📊</span>
              <span>长桥 API 数据</span>
            </div>
          )}
          
          {/* 关键指标 */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div>
              <div className={`text-xs ${colors.textMuted}`}>今开</div>
              <div className="text-sm">{stock.open.toFixed(2)}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>最高</div>
              <div className="text-sm text-red-500">{stock.high.toFixed(2)}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>最低</div>
              <div className="text-sm text-green-500">{stock.low.toFixed(2)}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>昨收</div>
              <div className="text-sm">{stock.prevClose.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div>
              <div className={`text-xs ${colors.textMuted}`}>成交量</div>
              <div className="text-sm">{(stock.volume / 10000).toFixed(0)}万</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>市盈率</div>
              <div className="text-sm">{(stock as any).pe ? (stock as any).pe.toFixed(1) : '-'}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>52周高</div>
              <div className="text-sm">-</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>52周低</div>
              <div className="text-sm">-</div>
            </div>
          </div>
        </div>
        
        {/* Tab 切换 - 港股多一个窝轮Tab */}
        <div className={`flex border-b ${colors.border}`}>
          {(market === 'HK' ? ['chart', 'warrant', 'info', 'news'] as const : ['chart', 'info', 'news'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-center text-sm ${
                activeTab === tab
                  ? `${colors.text} border-b-2 border-orange-500`
                  : colors.textMuted
              }`}
            >
              {tab === 'chart' ? '图表' : tab === 'warrant' ? '窝轮' : tab === 'info' ? '简况' : '资讯'}
            </button>
          ))}
        </div>
        
        {/* 内容区 */}
        <div className="p-4">
          {activeTab === 'chart' && (
            <KlineChartWrapper symbol={symbol} market={market} theme={theme} />
          )}
          
          {activeTab === 'warrant' && market === 'HK' && (
            <WarrantListWrapper symbol={symbol} theme={theme} colors={colors} />
          )}
          
          {activeTab === 'info' && (
            <div className={`${colors.bgCard} rounded-lg p-4 space-y-3`}>
              <div className="flex justify-between">
                <span className={colors.textMuted}>股票代码</span>
                <span>{stock.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className={colors.textMuted}>公司名称</span>
                <span>{stock.name}</span>
              </div>
              <div className="flex justify-between">
                <span className={colors.textMuted}>交易市场</span>
                <span>{market === 'HK' ? '香港交易所' : '美国股市'}</span>
              </div>
              <div className="flex justify-between">
                <span className={colors.textMuted}>货币</span>
                <span>{market === 'HK' ? 'HKD' : 'USD'}</span>
              </div>
            </div>
          )}
          
          {activeTab === 'news' && (
            <div className={`${colors.bgCard} rounded-lg p-4`}>
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📰</div>
                <div className={colors.textMuted}>暂无相关资讯</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 底部买卖按钮 */}
      <div className={`fixed bottom-0 left-0 right-0 ${colors.bgCard} border-t ${colors.border} p-4`}>
        <div className="max-w-lg mx-auto flex gap-4">
          <button
            onClick={() => {
              setTradeType('buy');
              setShowTradeModal(true);
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
          >
            买入
          </button>
          <button
            onClick={() => {
              setTradeType('sell');
              setShowTradeModal(true);
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
          >
            卖出
          </button>
        </div>
      </div>
      
      {/* 交易弹窗 */}
      {showTradeModal && (
        <TradeModal
          stock={stock}
          tradeType={tradeType}
          setTradeType={setTradeType}
          onClose={() => setShowTradeModal(false)}
          colors={colors}
        />
      )}
    </main>
  );
}

// 交易弹窗组件
function TradeModal({
  stock,
  tradeType,
  setTradeType,
  onClose,
  colors,
}: {
  stock: { symbol: string; name: string; price: number; market: string };
  tradeType: 'buy' | 'sell';
  setTradeType: (t: 'buy' | 'sell') => void;
  onClose: () => void;
  colors: typeof themeColors.dark;
}) {
  const [price, setPrice] = useState(stock.price.toFixed(2));
  const [quantity, setQuantity] = useState('100');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const lotSize = stock.market === 'HK' ? 100 : 1;
  const total = parseFloat(price) * parseInt(quantity || '0');
  const currency = stock.market === 'HK' ? 'HKD' : 'USD';

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitOrder({
        symbol: stock.symbol,
        side: tradeType,
        orderType,
        price: orderType === 'limit' ? parseFloat(price) : undefined,
        quantity: parseInt(quantity),
      });
      setResult({ success: res.success, message: res.message || '订单已提交' });
    } catch (err) {
      setResult({ success: false, message: '提交失败' });
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className={`w-full max-w-lg ${colors.bgCard} rounded-t-2xl`}>
        {/* 标题 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="font-bold">{stock.name} ({stock.symbol})</span>
          <button onClick={onClose} className={colors.textMuted}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {result ? (
          <div className="p-6 text-center">
            <div className={`text-4xl mb-3 ${result.success ? 'text-green-500' : 'text-red-500'}`}>
              {result.success ? '✓' : '✗'}
            </div>
            <div className="text-lg mb-4">{result.message}</div>
            <button
              onClick={onClose}
              className="px-8 py-2 bg-orange-500 text-white rounded-lg"
            >
              确定
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* 买卖切换 */}
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setTradeType('buy')}
                className={`flex-1 py-2 font-bold ${
                  tradeType === 'buy'
                    ? 'bg-green-600 text-white'
                    : `${colors.bgCard} ${colors.textMuted}`
                }`}
              >
                买入
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={`flex-1 py-2 font-bold ${
                  tradeType === 'sell'
                    ? 'bg-red-600 text-white'
                    : `${colors.bgCard} ${colors.textMuted}`
                }`}
              >
                卖出
              </button>
            </div>

            {/* 订单类型 */}
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType('limit')}
                className={`px-4 py-1 rounded text-sm ${
                  orderType === 'limit'
                    ? 'bg-orange-500 text-white'
                    : `${colors.bg} ${colors.textMuted}`
                }`}
              >
                限价单
              </button>
              <button
                onClick={() => setOrderType('market')}
                className={`px-4 py-1 rounded text-sm ${
                  orderType === 'market'
                    ? 'bg-orange-500 text-white'
                    : `${colors.bg} ${colors.textMuted}`
                }`}
              >
                市价单
              </button>
            </div>

            {/* 价格输入 */}
            {orderType === 'limit' && (
              <div>
                <label className={`text-sm ${colors.textMuted}`}>价格 ({currency})</label>
                <div className="flex items-center mt-1">
                  <button
                    onClick={() => setPrice((parseFloat(price) - 0.01).toFixed(2))}
                    className={`px-3 py-2 ${colors.bg} rounded-l`}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`flex-1 text-center py-2 ${colors.bg} ${colors.text} border-x ${colors.border}`}
                  />
                  <button
                    onClick={() => setPrice((parseFloat(price) + 0.01).toFixed(2))}
                    className={`px-3 py-2 ${colors.bg} rounded-r`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* 数量输入 */}
            <div>
              <label className={`text-sm ${colors.textMuted}`}>数量 (每手 {lotSize} 股)</label>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => setQuantity(String(Math.max(lotSize, parseInt(quantity || '0') - lotSize)))}
                  className={`px-3 py-2 ${colors.bg} rounded-l`}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`flex-1 text-center py-2 ${colors.bg} ${colors.text} border-x ${colors.border}`}
                />
                <button
                  onClick={() => setQuantity(String(parseInt(quantity || '0') + lotSize))}
                  className={`px-3 py-2 ${colors.bg} rounded-r`}
                >
                  +
                </button>
              </div>
            </div>

            {/* 预估金额 */}
            <div className={`p-3 ${colors.bg} rounded-lg`}>
              <div className="flex justify-between">
                <span className={colors.textMuted}>预估金额</span>
                <span className="font-bold">
                  {currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-bold text-white ${
                tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } ${submitting ? 'opacity-50' : ''}`}
            >
              {submitting ? '提交中...' : `确认${tradeType === 'buy' ? '买入' : '卖出'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
