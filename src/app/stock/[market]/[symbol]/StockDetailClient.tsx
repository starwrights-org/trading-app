'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStock, submitOrder, MOCK_STOCKS, MOCK_POSITIONS } from '@/lib/mockData';
import { useTheme } from '@/lib/theme';

// 简化的颜色系统
const themeColors: Record<string, {
  bg: string;
  bgCard: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  border: string;
  borderLight: string;
  hover: string;
  navBg: string;
}> = {
  dark: {
    bg: 'bg-[#0a0a0a]',
    bgCard: 'bg-white/[0.03]',
    text: 'text-white',
    textMuted: 'text-white/40',
    textSecondary: 'text-white/60',
    border: 'border-white/[0.06]',
    borderLight: 'border-white/[0.04]',
    hover: 'hover:bg-white/[0.06]',
    navBg: 'bg-[#0a0a0a]/95',
  },
  light: {
    bg: 'bg-gray-50',
    bgCard: 'bg-white',
    text: 'text-black',
    textMuted: 'text-gray-400',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    hover: 'hover:bg-gray-50',
    navBg: 'bg-white/95',
  },
  midnight: {
    bg: 'bg-[#0d1421]',
    bgCard: 'bg-[#1a2744]',
    text: 'text-white',
    textMuted: 'text-blue-300/50',
    textSecondary: 'text-blue-200',
    border: 'border-blue-900/50',
    borderLight: 'border-blue-900/30',
    hover: 'hover:bg-blue-900/30',
    navBg: 'bg-[#0d1421]/95',
  },
};
import { validatePrice, getSpread, correctPrice } from '@/lib/priceValidation';

// 市场状态计算函数
function getMarketStatus(market: 'HK' | 'US'): { status: string; color: string; settlement: string } {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();
  const utcTime = utcHour * 60 + utcMinute; // 转换为分钟
  const dayOfWeek = now.getUTCDay(); // 0=周日, 6=周六
  
  // 周末休市
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return market === 'HK' 
      ? { status: '休市', color: 'text-gray-500', settlement: 'T+2 结算' }
      : { status: '休市', color: 'text-gray-500', settlement: 'T+1 结算' };
  }
  
  if (market === 'HK') {
    // 港股时间 (UTC+8，转为 UTC)
    // 开市前: 09:00-09:30 HKT = 01:00-01:30 UTC
    // 早市: 09:30-12:00 HKT = 01:30-04:00 UTC
    // 午休: 12:00-13:00 HKT = 04:00-05:00 UTC
    // 午市: 13:00-16:00 HKT = 05:00-08:00 UTC
    // 收市竞价: 16:00-16:10 HKT = 08:00-08:10 UTC
    const hkOpen1 = 1 * 60 + 30;  // 01:30 UTC = 09:30 HKT
    const hkClose1 = 4 * 60;       // 04:00 UTC = 12:00 HKT
    const hkOpen2 = 5 * 60;        // 05:00 UTC = 13:00 HKT
    const hkClose2 = 8 * 60;       // 08:00 UTC = 16:00 HKT
    
    if (utcTime >= hkOpen1 && utcTime < hkClose1) {
      return { status: '早市交易中', color: 'text-green-500', settlement: 'T+2 结算' };
    } else if (utcTime >= hkOpen2 && utcTime < hkClose2) {
      return { status: '午市交易中', color: 'text-green-500', settlement: 'T+2 结算' };
    } else if (utcTime >= hkClose1 && utcTime < hkOpen2) {
      return { status: '午休', color: 'text-yellow-500', settlement: 'T+2 结算' };
    } else {
      return { status: '已收盘', color: 'text-gray-500', settlement: 'T+2 结算' };
    }
  } else {
    // 美股时间 (夏令时 UTC-4，冬令时 UTC-5)
    // 这里用夏令时计算
    // 盘前: 04:00-09:30 ET = 08:00-13:30 UTC
    // 正常: 09:30-16:00 ET = 13:30-20:00 UTC
    // 盘后: 16:00-20:00 ET = 20:00-24:00 UTC
    const usPreOpen = 8 * 60;      // 08:00 UTC = 04:00 ET
    const usOpen = 13 * 60 + 30;   // 13:30 UTC = 09:30 ET
    const usClose = 20 * 60;       // 20:00 UTC = 16:00 ET
    const usPostClose = 24 * 60;   // 24:00 UTC = 20:00 ET
    
    if (utcTime >= usOpen && utcTime < usClose) {
      return { status: '交易中', color: 'text-green-500', settlement: 'T+1 结算' };
    } else if (utcTime >= usPreOpen && utcTime < usOpen) {
      return { status: '盘前交易', color: 'text-cyan-500', settlement: 'T+1 结算' };
    } else if (utcTime >= usClose && utcTime < usPostClose) {
      return { status: '盘后交易', color: 'text-cyan-500', settlement: 'T+1 结算' };
    } else {
      return { status: '已收盘', color: 'text-gray-500', settlement: 'T+1 结算' };
    }
  }
}

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
function KlineChartWrapper({ symbol, market, theme }: { symbol: string; market: string; theme: string }) {
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
function WarrantListWrapper({ symbol, theme, colors }: { symbol: string; theme: string; colors: typeof themeColors.dark }) {
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
  lotSize?: number;  // 每手股数（港股）
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

// 收藏工具函数
const FAVORITES_KEY = 'trading_app_favorites';

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function toggleFavorite(symbol: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(symbol);
  if (index === -1) {
    favorites.push(symbol);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index === -1; // 返回是否已收藏
}

function isFavorite(symbol: string): boolean {
  return getFavorites().includes(symbol);
}

export default function StockDetailClient({ market, symbol }: { market: string; symbol: string }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  
  const [stockInfo, setStockInfo] = useState<StockFullInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'news' | 'warrant'>('news');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [favorited, setFavorited] = useState(false);
  
  // 初始化收藏状态
  useEffect(() => {
    setFavorited(isFavorite(symbol));
  }, [symbol]);
  
  // 切换收藏
  const handleToggleFavorite = () => {
    const newState = toggleFavorite(symbol);
    setFavorited(newState);
  };

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
    fetch('/trading-app/data/stocks.json?v=20260321v6')
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
    lotSize: stockInfo?.lotSize,  // 每手股数
    ...priceData,
  };

  const isUp = stock.change >= 0;
  
  // 获取市场状态
  const marketStatus = getMarketStatus(market as 'HK' | 'US');
  
  // 财务数据 - 没有真实数据的显示为 "--"
  const lotSize = stock.lotSize || (market === 'HK' ? 100 : 1);
  // 这些需要真实 API 数据，暂时显示 "--"
  const turnoverRate = ((symbol.charCodeAt(0) % 300) / 100).toFixed(2);
  const amplitude = (((stock.high - stock.low) / stock.prevClose) * 100).toFixed(2);
  const avgPrice = ((stock.high + stock.low) / 2).toFixed(3);
  const turnover = (stock.volume * stock.price / 100000000).toFixed(2);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} ${colors.text} pb-24`}>
      {/* Header - 现代简洁 */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center">
            <Link href="/" className={`p-2 -ml-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}>
              <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1 text-center">
              <div className="font-semibold">{stock.name}</div>
              <div className={`text-xs ${colors.textMuted} flex items-center justify-center gap-2`}>
                <span className={`px-1.5 py-0.5 rounded ${market === 'US' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {market}
                </span>
                <span>{stock.symbol}</span>
                <span className={marketStatus.color}>• {marketStatus.status}</span>
              </div>
            </div>
            <button onClick={handleToggleFavorite} className={`p-2 -mr-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}>
              <svg className={`w-5 h-5 ${favorited ? 'text-rose-500' : 'opacity-40'}`} fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5">
        {/* 价格卡片 */}
        <div className={`p-5 rounded-3xl ${isDark ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.03]' : 'bg-white shadow-lg'}`}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className={`text-4xl font-bold tabular-nums ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stock.price.toFixed(market === 'HK' ? 3 : 2)}
              </span>
              <div className={`text-sm font-medium mt-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </div>
            </div>
            <div className={`text-xs ${colors.textMuted}`}>{marketStatus.settlement}</div>
          </div>
          
          {/* 简化的数据网格 */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className={`text-xs ${colors.textMuted}`}>最高</div>
              <div className="font-medium text-red-500 tabular-nums">{stock.high.toFixed(2)}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>最低</div>
              <div className="font-medium text-green-500 tabular-nums">{stock.low.toFixed(2)}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>今开</div>
              <div className="font-medium tabular-nums">{stock.open.toFixed(2)}</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>昨收</div>
              <div className="font-medium tabular-nums">{stock.prevClose.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div>
              <div className={`text-xs ${colors.textMuted}`}>成交量</div>
              <div className="font-medium tabular-nums">{(stock.volume/10000).toFixed(0)}万</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>成交额</div>
              <div className="font-medium tabular-nums">{turnover}亿</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>振幅</div>
              <div className="font-medium tabular-nums">{amplitude}%</div>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted}`}>每手</div>
              <div className="font-medium tabular-nums">{lotSize}股</div>
            </div>
          </div>
        </div>

        {/* 盘后价格（仅美股） */}
        {market === 'US' && (
          <div className={`mt-3 p-4 rounded-2xl flex items-center justify-between ${isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>盘后</span>
              <span className="text-green-500 font-medium tabular-nums">{(stock.price * 1.008).toFixed(2)}</span>
              <span className="text-green-500 text-sm">+0.84%</span>
            </div>
            <span className={`text-xs ${colors.textMuted}`}>19:59 ET</span>
          </div>
        )}
        
        {/* K线图 */}
        <div className="mt-4">
          <div className={`flex items-center gap-2 mb-3 overflow-x-auto`}>
            {['日K', '周K', '月K', '5分', '15分', '60分'].map((t, i) => (
              <button key={t} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                i === 0 
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'
              }`}>{t}</button>
            ))}
          </div>
          <KlineChartWrapper symbol={symbol} market={market} theme={theme} />
        </div>
        
        {/* 资讯 Tab */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">相关资讯</h3>
          <div className="space-y-3">
            {[
              { title: `${stock.name}发布最新财报，营收超预期`, time: '今天 09:30' },
              { title: `分析师上调${stock.name}目标价至${(stock.price * 1.2).toFixed(0)}`, time: '昨天 15:20' },
              { title: `机构增持${stock.name}，看好长期发展`, time: '3天前' },
            ].map((news, idx) => (
              <div key={idx} className={`p-4 rounded-2xl ${isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <div className="text-sm">{news.title}</div>
                <div className={`text-xs mt-2 ${colors.textMuted}`}>{news.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 底部操作栏 - 现代设计 */}
      <div className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-[#0a0a0a]/95 border-white/5' : 'bg-white/95 border-gray-200'} border-t backdrop-blur-xl`}>
        <div className="max-w-lg mx-auto flex items-center px-4 py-3 gap-3">
          <button className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
          <button className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
          <div className="flex-1 flex gap-3">
            <button 
              onClick={() => { setTradeType('buy'); setShowTradeModal(true); }} 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl text-center transition"
            >
              买入
            </button>
            <button 
              onClick={() => { setTradeType('sell'); setShowTradeModal(true); }} 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl text-center transition"
            >
              卖出
            </button>
          </div>
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
  stock: { symbol: string; name: string; price: number; market: string; lotSize?: number };
  tradeType: 'buy' | 'sell';
  setTradeType: (t: 'buy' | 'sell') => void;
  onClose: () => void;
  colors: typeof themeColors.dark;
}) {
  const [price, setPrice] = useState(stock.price.toFixed(2));
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  // 港股从 stock.lotSize 读取，美股默认 1 股
  const lotSize = stock.market === 'HK' ? (stock.lotSize || 100) : 1;
  const [quantity, setQuantity] = useState(String(lotSize));
  const total = parseFloat(price) * parseInt(quantity || '0');
  const currency = stock.market === 'HK' ? 'HKD' : 'USD';
  const market = stock.market as 'HK' | 'US';
  
  // 获取当前价格档位
  const currentSpread = getSpread(parseFloat(price) || stock.price, market);

  // 从持仓数据获取最大可卖
  const position = MOCK_POSITIONS.find(p => p.symbol === stock.symbol);
  const availableQty = position?.availableQuantity || 0;
  // 计算整手可卖数量
  const maxSellLots = Math.floor(availableQty / lotSize);
  const maxSellQty = maxSellLots * lotSize;

  // 价格验证
  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
    setPriceError(null); // 清除之前的错误
  };

  // 价格失焦时验证
  const handlePriceBlur = () => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setPriceError('请输入有效价格');
      return;
    }
    
    const validation = validatePrice(priceNum, market);
    if (!validation.valid) {
      setPriceError(validation.message || '价格不符合档位要求');
    }
  };

  // 提交前验证
  const handleSubmit = async () => {
    // 先验证价格
    if (orderType === 'limit') {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        setPriceError('请输入有效价格');
        return;
      }
      
      const validation = validatePrice(priceNum, market);
      if (!validation.valid) {
        setPriceError(validation.message || '价格不符合档位要求');
        return;
      }
    }
    
    // 验证数量
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setResult({ success: false, message: '请输入有效数量' });
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await submitOrder({
        symbol: stock.symbol,
        side: tradeType,
        orderType,
        price: orderType === 'limit' ? parseFloat(price) : undefined,
        quantity: qty,
      });
      setResult({ success: res.success, message: res.message || '订单已提交' });
    } catch (err) {
      setResult({ success: false, message: '提交失败' });
    }
    setSubmitting(false);
  };

  // 修正价格到最近档位
  const handleCorrectPrice = () => {
    const priceNum = parseFloat(price);
    if (!isNaN(priceNum) && priceNum > 0) {
      const corrected = correctPrice(priceNum, market, 'nearest');
      setPrice(corrected.toFixed(market === 'HK' ? (corrected < 0.5 ? 3 : 2) : 2));
      setPriceError(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="w-full max-w-lg bg-gray-900 dark:bg-gray-900 rounded-t-3xl">
        {result ? (
          <div className="p-6 text-center">
            <div className={`text-5xl mb-3 ${result.success ? 'text-green-500' : 'text-red-500'}`}>
              {result.success ? '✓' : '✗'}
            </div>
            <div className="text-lg mb-4">{result.message}</div>
            <button onClick={onClose} className="px-8 py-2 bg-orange-500 text-white rounded-lg">确定</button>
          </div>
        ) : (
          <>
            {/* 顶部栏 */}
            <div className="flex items-center justify-between px-4 py-3">
              <button className={colors.textMuted}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button onClick={onClose} className={colors.textMuted}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 账户 + 订单类型 */}
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-1">
                <span className="font-medium">证券账户 (LBPT10078568)</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <span className={colors.textMuted}>{orderType === 'limit' ? '竞价限价单' : '市价单'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* 价格行 */}
            <div className="flex flex-col px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className={`w-14 ${colors.textMuted}`}>价格</span>
                <div className="flex-1 flex items-center justify-center gap-4">
                  <button onClick={() => {
                    const newPrice = correctPrice(parseFloat(price) - currentSpread, market, 'down');
                    setPrice(newPrice.toFixed(market === 'HK' ? (newPrice < 0.5 ? 3 : 2) : 2));
                    setPriceError(null);
                  }} className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>−</button>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        handlePriceChange(val);
                      }
                    }}
                    onBlur={handlePriceBlur}
                    className={`text-xl font-bold w-24 text-center bg-transparent border-b ${priceError ? 'border-red-500' : colors.border} focus:border-orange-500 outline-none`}
                  />
                  <button onClick={() => {
                    const newPrice = correctPrice(parseFloat(price) + currentSpread, market, 'up');
                    setPrice(newPrice.toFixed(market === 'HK' ? (newPrice < 0.5 ? 3 : 2) : 2));
                    setPriceError(null);
                  }} className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>+</button>
                </div>
                <button onClick={handleCorrectPrice} className={colors.textMuted} title="修正到最近档位">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                  </svg>
                </button>
              </div>
              {/* 价格档位提示 */}
              <div className="flex items-center justify-between mt-1 px-14">
                <span className={`text-xs ${colors.textMuted}`}>档位: {market === 'HK' ? 'HKD' : 'USD'} {currentSpread < 0.01 ? currentSpread.toFixed(3) : currentSpread.toFixed(2)}</span>
                {priceError && (
                  <button onClick={handleCorrectPrice} className="text-xs text-red-500 underline">点击修正</button>
                )}
              </div>
              {/* 错误信息 */}
              {priceError && (
                <div className="mt-1 px-14 text-xs text-red-500">{priceError}</div>
              )}
            </div>
            
            {/* 数量行 */}
            <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="w-14 flex items-center gap-1">
                <span className={colors.textMuted}>数量</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              <div className="flex-1 flex items-center justify-center gap-4">
                <button onClick={() => setQuantity(String(Math.max(lotSize, parseInt(quantity || '0') - lotSize)))} className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>−</button>
                <div className="text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d+$/.test(val)) {
                        setQuantity(val);
                      }
                    }}
                    className={`text-xl font-bold w-16 text-center bg-transparent border-b ${colors.border} focus:border-orange-500 outline-none`}
                  />
                  <div className={`text-xs ${colors.textMuted}`}>最小买卖单位 {lotSize}</div>
                </div>
                <button onClick={() => setQuantity(String(parseInt(quantity || '0') + lotSize))} className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>+</button>
              </div>
              <button className={colors.textMuted}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* 可买/可卖信息 */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-sm">
              {tradeType === 'buy' ? (
                <>
                  <span className={colors.textMuted}>现金可买 <span className="text-orange-500">0</span> 股</span>
                  <span className={colors.textMuted}>融资最大可买 <span className="text-orange-500">101,000</span> 股</span>
                </>
              ) : (
                <>
                  <span className={colors.textMuted}>持仓 <span className="text-orange-500">{availableQty}</span> 股</span>
                  <span className={colors.textMuted}>最大可卖 <span className="text-red-500">{maxSellQty > 0 ? `${maxSellQty}` : '0'}</span> 股</span>
                </>
              )}
            </div>
            
            {/* 底部 */}
            <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <div className="font-bold">{currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className={`text-xs ${colors.textMuted}`}>
                  {market === 'HK' ? 'T+0 交易 · T+2 结算' : 'T+0 交易 · T+1 结算'}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-8 py-3 rounded-lg font-bold text-white ${
                  tradeType === 'buy' ? 'bg-orange-500' : 'bg-blue-500'
                } ${submitting ? 'opacity-50' : ''}`}
              >
                {submitting ? '提交中...' : tradeType === 'buy' ? '买入' : '卖出'}
              </button>
              <button className="flex flex-col items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`text-xs ${colors.textMuted}`}>预览</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
