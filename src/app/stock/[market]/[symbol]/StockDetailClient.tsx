'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStock, submitOrder, MOCK_STOCKS, MOCK_POSITIONS } from '@/lib/mockData';
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

export default function StockDetailClient({ market, symbol }: { market: string; symbol: string }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [stockInfo, setStockInfo] = useState<StockFullInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'news' | 'warrant'>('news');
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
  
  // 生成财务数据
  const lotSize = stock.lotSize || (market === 'HK' ? 100 : 1);
  const marketCap = stock.price * (5000 + Math.abs(symbol.charCodeAt(0) % 50000));
  const pe = 10 + (symbol.charCodeAt(0) % 30);
  const pb = 1 + (symbol.charCodeAt(1) || 0) % 5;
  const turnoverRate = ((symbol.charCodeAt(0) % 300) / 100).toFixed(2);
  const amplitude = (((stock.high - stock.low) / stock.prevClose) * 100).toFixed(2);
  const week52High = (stock.high * 1.3).toFixed(3);
  const week52Low = (stock.low * 0.7).toFixed(3);
  const totalShares = (marketCap / stock.price).toFixed(2);
  const floatShares = (parseFloat(totalShares) * 0.85).toFixed(2);
  const eps = (stock.price / pe).toFixed(2);
  const avgPrice = ((stock.high + stock.low) / 2).toFixed(3);
  const netAssetPerShare = (stock.price / pb).toFixed(2);
  const turnover = (stock.volume * stock.price / 100000000).toFixed(2);

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-24`}>
      {/* Header - 长桥风格 */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/search" className={`mr-4 ${colors.textSecondary}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <div className="font-bold">{stock.symbol} {stock.name}</div>
            <div className={`text-xs ${colors.textMuted}`}>
              {market === 'HK' ? '港股' : '美股'} {new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
            </div>
          </div>
          <button className="flex flex-col items-center text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-xs">258k</span>
          </button>
        </div>
        
        {/* 行情/全景/财务 Tab */}
        <div className="max-w-lg mx-auto flex border-b border-gray-200 dark:border-gray-700">
          {['行情', '全景', '财务'].map((tab, i) => (
            <button key={tab} className={`flex-1 py-2 text-center ${i === 0 ? 'border-b-2 border-black dark:border-white font-bold' : colors.textMuted}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 价格信息 - 长桥风格 */}
        <div className="px-4 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.price.toFixed(3)}
                </span>
                <span className={`text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isUp ? '+' : ''}{stock.change.toFixed(3)}
                </span>
              </div>
              <div className={`text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
            <div className="flex gap-1 text-lg">
              {market === 'US' ? '🇺🇸' : '🇭🇰'} 📊 🔔
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bgCard} ${colors.textMuted}`}>
              今日成交额 Top 14
            </span>
          </div>
        </div>
        
        {/* 详细数据表格 - 长桥风格 4列布局 */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-4 gap-x-2 gap-y-2 text-sm">
            <div><div className={`text-xs ${colors.textMuted}`}>最高</div><div className="text-red-500">{stock.high.toFixed(3)}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>今开</div><div>{stock.open.toFixed(3)}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>换手率</div><div>{turnoverRate}%</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>市盈率<sup>TTM</sup></div><div>{pe.toFixed(2)}</div></div>
            
            <div><div className={`text-xs ${colors.textMuted}`}>最低</div><div className="text-green-500">{stock.low.toFixed(3)}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>昨收</div><div>{stock.prevClose.toFixed(3)}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>成交额</div><div>{turnover}亿</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>总市值</div><div>{marketCap > 10000 ? (marketCap/10000).toFixed(2)+'万亿' : marketCap.toFixed(0)+'亿'}</div></div>
            
            <div><div className={`text-xs ${colors.textMuted}`}>52周高</div><div>{week52High}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>委比</div><div>--</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>成交量</div><div>{(stock.volume/10000).toFixed(0)}万股</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>总股本</div><div>{totalShares}亿股</div></div>
            
            <div><div className={`text-xs ${colors.textMuted}`}>52周低</div><div>{week52Low}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>量比</div><div>--</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>振幅</div><div>{amplitude}%</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>流通量</div><div>{floatShares}亿股</div></div>
            
            <div><div className={`text-xs ${colors.textMuted}`}>流通市值</div><div>{(parseFloat(floatShares)*stock.price).toFixed(0)}亿</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>每股收益</div><div>{eps}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>市净率</div><div>{pb.toFixed(2)}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>股息率</div><div>--</div></div>
            
            <div><div className={`text-xs ${colors.textMuted}`}>均价</div><div>{avgPrice}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>每股净资产</div><div>{netAssetPerShare}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>每手</div><div>{lotSize}</div></div>
            <div><div className={`text-xs ${colors.textMuted}`}>货币</div><div>{market === 'HK' ? 'HKD' : 'USD'}</div></div>
          </div>
        </div>
        
        {/* 大笔买入提示 */}
        <div className={`mx-4 px-3 py-2 ${colors.bgCard} rounded-lg flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-orange-500">⚡</span>
            <span className="text-sm">大笔买入</span>
            <span className="text-green-500 text-sm">1,760 股 ↑</span>
          </div>
          <span className={`text-xs ${colors.textMuted}`}>15:49:04 {market === 'HK' ? '港股' : '美东'} ›</span>
        </div>
        
        {/* 盘后价格（仅美股） */}
        {market === 'US' && (
          <div className={`mx-4 mt-2 px-3 py-2 ${colors.bgCard} rounded-lg flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${colors.textMuted}`}>盘后</span>
              <span className="text-green-500 text-sm">{(stock.price * 1.008).toFixed(3)} +{(stock.price * 0.008).toFixed(3)} (+0.84%)</span>
            </div>
            <span className={`text-xs ${colors.textMuted}`}>19:59:57 美东 ›</span>
          </div>
        )}
        
        {/* K线时间Tab */}
        <div className={`mt-4 border-t ${colors.border}`}>
          <div className="flex items-center gap-3 px-4 py-2 overflow-x-auto text-sm">
            {['盘后', '5日', '日K', '周K', '月K', '年K', '1分'].map((t, i) => (
              <button key={t} className={i === 2 ? 'font-bold' : colors.textMuted}>{t}</button>
            ))}
          </div>
          <div className="px-4"><KlineChartWrapper symbol={symbol} market={market} theme={theme} /></div>
        </div>
        
        {/* 底部 Tab - 港股多一个窝轮Tab */}
        <div className={`flex border-t ${colors.border} mt-4`}>
          {(market === 'HK' ? ['资讯', '窝轮', '讨论', '公告'] : ['资讯', '讨论', '公告']).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab === '窝轮' ? 'warrant' : tab === '资讯' ? 'news' : 'info')}
              className={`flex-1 py-3 text-center text-sm ${
                (activeTab === 'warrant' && tab === '窝轮') || 
                (activeTab === 'news' && tab === '资讯') ||
                (activeTab === 'info' && (tab === '讨论' || tab === '公告'))
                  ? `${colors.text} font-bold`
                  : colors.textMuted
              }`}
            >
              {tab}{tab === '资讯' && <span className="text-orange-500 ml-0.5">•</span>}
            </button>
          ))}
        </div>
        
        {/* 内容区 */}
        <div className="p-4">
          {activeTab === 'warrant' && market === 'HK' && (
            <WarrantListWrapper symbol={symbol} theme={theme} colors={colors} />
          )}
          
          {activeTab === 'news' && (
            <div className={`${colors.bgCard} rounded-lg p-4 space-y-3`}>
              <div className={`pb-3 border-b ${colors.border}`}>
                <div className="text-sm">{stock.name}发布最新财报，营收超预期</div>
                <div className={`text-xs ${colors.textMuted} mt-1`}>今天 09:30</div>
              </div>
              <div className={`pb-3 border-b ${colors.border}`}>
                <div className="text-sm">分析师上调{stock.name}目标价至{(stock.price * 1.2).toFixed(0)}</div>
                <div className={`text-xs ${colors.textMuted} mt-1`}>昨天 15:20</div>
              </div>
              <div>
                <div className="text-sm">机构增持{stock.name}，看好长期发展</div>
                <div className={`text-xs ${colors.textMuted} mt-1`}>3天前</div>
              </div>
            </div>
          )}
          
          {activeTab === 'info' && (
            <div className={`${colors.bgCard} rounded-lg p-4 text-center py-8`}>
              <div className="text-4xl mb-2">💬</div>
              <div className={colors.textMuted}>暂无讨论</div>
            </div>
          )}
        </div>
      </div>
      
      {/* 底部操作栏 - 长桥风格 */}
      <div className={`fixed bottom-0 left-0 right-0 ${colors.bgCard} border-t ${colors.border}`}>
        <div className="max-w-lg mx-auto flex items-center px-3 py-2 gap-2">
          <button className="flex flex-col items-center w-12">
            <span className="text-lg">🔲</span>
            <span className={`text-xs ${colors.textMuted}`}>更多</span>
          </button>
          <button className="flex flex-col items-center w-12">
            <span className="text-lg">↗️</span>
            <span className={`text-xs ${colors.textMuted}`}>分享</span>
          </button>
          <button className="flex flex-col items-center w-12">
            <span className="text-lg">🎯</span>
            <span className={`text-xs ${colors.textMuted}`}>{market === 'HK' ? '轮证' : '期权'}</span>
          </button>
          <div className="flex-1 flex gap-3 ml-2">
            <button 
              onClick={() => { setTradeType('buy'); setShowTradeModal(true); }} 
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-center"
            >
              买入
            </button>
            <button 
              onClick={() => { setTradeType('sell'); setShowTradeModal(true); }} 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-center"
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

  // 港股从 stock.lotSize 读取，美股默认 1 股
  const lotSize = stock.market === 'HK' ? (stock.lotSize || 100) : 1;
  const [quantity, setQuantity] = useState(String(lotSize));
  const total = parseFloat(price) * parseInt(quantity || '0');
  const currency = stock.market === 'HK' ? 'HKD' : 'USD';

  // 从持仓数据获取最大可卖
  const position = MOCK_POSITIONS.find(p => p.symbol === stock.symbol);
  const availableQty = position?.availableQuantity || 0;
  // 计算整手可卖数量
  const maxSellLots = Math.floor(availableQty / lotSize);
  const maxSellQty = maxSellLots * lotSize;

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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className={`w-full max-w-lg ${colors.bgCard} rounded-t-3xl`}>
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
            <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <span className={`w-14 ${colors.textMuted}`}>价格</span>
              <div className="flex-1 flex items-center justify-center gap-4">
                <button onClick={() => setPrice((parseFloat(price) - 0.01).toFixed(2))} className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>−</button>
                <span className="text-xl font-bold w-24 text-center">{price}</span>
                <button onClick={() => setPrice((parseFloat(price) + 0.01).toFixed(2))} className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>+</button>
              </div>
              <button className={colors.textMuted}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <circle cx="12" cy="12" r="3" strokeWidth={2} />
                </svg>
              </button>
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
                  <span className="text-xl font-bold">{quantity || '0'}</span>
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
                <div className={`text-xs ${colors.textMuted}`}>预估成交后成本 --</div>
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
