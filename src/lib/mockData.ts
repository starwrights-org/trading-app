import { Stock, Position, Order, AccountBalance, Kline } from './types';

// 实时股票数据 - 长桥 API 更新 2026-03-21 14:48 UTC
export const MOCK_STOCKS: Stock[] = [
  // 港股 - 长桥 API 实时数据 (15分钟延迟)
  { symbol: '00700', name: '腾讯控股', nameEn: 'Tencent', market: 'HK', price: 508.00, change: -5.00, changePercent: -0.97, open: 505, high: 519, low: 505, prevClose: 513, volume: 24924662, pe: 19.2 },
  { symbol: '09988', name: '阿里巴巴-SW', nameEn: 'Alibaba', market: 'HK', price: 123.70, change: -8.30, changePercent: -6.29, open: 123.5, high: 126.8, low: 122.4, prevClose: 132, volume: 206068855, pe: 15.8 },
  { symbol: '03690', name: '美团-W', nameEn: 'Meituan', market: 'HK', price: 79.15, change: -1.55, changePercent: -1.92, open: 81.55, high: 82.65, low: 78.15, prevClose: 80.7, volume: 64632837, pe: 35.6 },
  { symbol: '01810', name: '小米集团-W', nameEn: 'Xiaomi', market: 'HK', price: 33.20, change: -3.12, changePercent: -8.59, open: 35.5, high: 35.64, low: 33.2, prevClose: 36.32, volume: 396613712, pe: 22.4 },
  { symbol: '00388', name: '香港交易所', nameEn: 'HKEX', market: 'HK', price: 396.00, change: -2.60, changePercent: -0.65, open: 398.6, high: 401, low: 395.2, prevClose: 398.6, volume: 4416051, pe: 38.5 },
  { symbol: '02318', name: '中国平安', nameEn: 'Ping An', market: 'HK', price: 61.75, change: 0.10, changePercent: 0.16, open: 61.65, high: 62.6, low: 61.35, prevClose: 61.65, volume: 31221069, pe: 7.8 },
  
  // 美股 - 长桥 API Nasdaq Basic 实时数据
  { symbol: 'AAPL', name: '苹果', nameEn: 'Apple', market: 'US', price: 247.99, change: -0.97, changePercent: -0.39, open: 247.975, high: 249.2, low: 246, prevClose: 248.96, volume: 88331081, pe: 31.2 },
  { symbol: 'NVDA', name: '英伟达', nameEn: 'NVIDIA', market: 'US', price: 172.70, change: -5.86, changePercent: -3.28, open: 178, high: 178.26, low: 171.72, prevClose: 178.56, volume: 241323528, pe: 35.1 },
  { symbol: 'TSLA', name: '特斯拉', nameEn: 'Tesla', market: 'US', price: 367.96, change: -12.34, changePercent: -3.24, open: 379.85, high: 379.89, low: 364.46, prevClose: 380.30, volume: 78628603, pe: 142.5 },
  { symbol: 'AMZN', name: '亚马逊', nameEn: 'Amazon', market: 'US', price: 205.37, change: -3.39, changePercent: -1.62, open: 207.4, high: 207.54, low: 204.316, prevClose: 208.76, volume: 63694603, pe: 28.5 },
  { symbol: 'GOOGL', name: '谷歌', nameEn: 'Alphabet', market: 'US', price: 301.00, change: -6.13, changePercent: -2.00, open: 305.46, high: 306, low: 298.27, prevClose: 307.13, volume: 44364079, pe: 27.8 },
  { symbol: 'META', name: 'Meta', nameEn: 'Meta Platforms', market: 'US', price: 593.66, change: -13.04, changePercent: -2.15, open: 603.53, high: 603.955, low: 587.25, prevClose: 606.70, volume: 21214898, pe: 20.2 },
];

// Mock 持仓数据 - 长桥 API 实时价格更新
export const MOCK_POSITIONS: Position[] = [
  { symbol: '00700', name: '腾讯控股', market: 'HK', quantity: 200, availableQuantity: 200, costPrice: 480.50, currentPrice: 508.00, marketValue: 101600, profitLoss: 5500, profitLossPercent: 5.72 },
  { symbol: 'NVDA', name: '英伟达', market: 'US', quantity: 50, availableQuantity: 50, costPrice: 165.20, currentPrice: 172.70, marketValue: 8635, profitLoss: 375, profitLossPercent: 4.54 },
  { symbol: 'AAPL', name: '苹果', market: 'US', quantity: 100, availableQuantity: 100, costPrice: 235.00, currentPrice: 247.99, marketValue: 24799, profitLoss: 1299, profitLossPercent: 5.53 },
];

// Mock 订单数据
export const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', symbol: '00700', name: '腾讯控股', market: 'HK', side: 'buy', orderType: 'limit', price: 500, quantity: 100, filledQuantity: 100, filledPrice: 499.80, status: 'filled', createdAt: '2026-03-21T09:30:00Z', updatedAt: '2026-03-21T09:30:15Z' },
  { id: 'ORD002', symbol: 'NVDA', name: '英伟达', market: 'US', side: 'buy', orderType: 'limit', price: 170, quantity: 30, filledQuantity: 0, status: 'pending', createdAt: '2026-03-21T09:35:00Z', updatedAt: '2026-03-21T09:35:00Z' },
  { id: 'ORD003', symbol: 'TSLA', name: '特斯拉', market: 'US', side: 'sell', orderType: 'market', quantity: 20, filledQuantity: 20, filledPrice: 365.10, status: 'filled', createdAt: '2026-03-20T22:15:00Z', updatedAt: '2026-03-20T22:15:03Z' },
];

// Mock 账户数据 - 统一资产数据
export const MOCK_ACCOUNT: AccountBalance = {
  currency: 'HKD',
  totalAssets: 799683.15,
  cashBalance: 727183.29,
  marketValue: 72499.86,
  buyingPower: 700000.00,
  frozenCash: 50000.00,
  todayProfitLoss: -1667.20,
  totalProfitLoss: -143.66,
};

// 分币种现金余额
export const CASH_BALANCES = {
  HKD: 20576.77,
  USD: 90673.71,
  CNH: 0,
};

// Mock K线数据生成
export function generateMockKline(days: number = 30): Kline[] {
  const klines: Kline[] = [];
  let basePrice = 500;
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const time = now - i * 24 * 60 * 60 * 1000;
    const change = (Math.random() - 0.5) * 20;
    const open = basePrice + change;
    const close = open + (Math.random() - 0.5) * 15;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(Math.random() * 10000000) + 5000000;
    
    klines.push({ time, open, high, low, close, volume });
    basePrice = close;
  }
  
  return klines;
}

// 获取股票（模拟 API）
export function getStock(symbol: string): Stock | undefined {
  return MOCK_STOCKS.find(s => s.symbol === symbol);
}

// 获取自选股（模拟）
export function getWatchlist(): Stock[] {
  return MOCK_STOCKS.slice(0, 6);
}

// 获取涨幅榜
export function getTopGainers(): Stock[] {
  return [...MOCK_STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
}

// 获取跌幅榜
export function getTopLosers(): Stock[] {
  return [...MOCK_STOCKS].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
}

// 获取成交额榜
export function getTopVolume(): Stock[] {
  return [...MOCK_STOCKS].sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5);
}

// 获取美股
export function getUSStocks(): Stock[] {
  return MOCK_STOCKS.filter(s => s.market === 'US');
}

// 获取港股
export function getHKStocks(): Stock[] {
  return MOCK_STOCKS.filter(s => s.market === 'HK');
}

// 搜索股票
export function searchStocks(query: string): Stock[] {
  const q = query.toUpperCase();
  return MOCK_STOCKS.filter(s => 
    s.symbol.toUpperCase().includes(q) || 
    s.name.includes(query) ||
    s.nameEn?.toUpperCase().includes(q)
  );
}

// 获取实时股票（从 API 或缓存）
export async function getStockRealtime(symbol: string): Promise<Stock | null> {
  // TODO: 对接长桥 API 获取实时数据
  console.log('📤 [预留接口] 获取实时行情:', symbol);
  return getStock(symbol) || null;
}

// 下单接口（预留）
export async function submitOrder(params: {
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'limit' | 'market';
  price?: number;
  quantity: number;
}): Promise<{ success: boolean; orderId?: string; message?: string }> {
  // TODO: 对接柜台 API
  console.log('📤 [预留接口] 提交订单:', params);
  
  // 生成订单ID
  const orderId = 'ORD' + Date.now();
  
  // 查找股票信息
  const stockInfo = MOCK_STOCKS.find(s => s.symbol === params.symbol) || 
                    { symbol: params.symbol, name: params.symbol, market: 'HK' as const };
  
  // 创建新订单
  const newOrder: Order = {
    id: orderId,
    symbol: params.symbol,
    name: stockInfo.name,
    market: stockInfo.market,
    side: params.side,
    orderType: params.orderType,
    price: params.price,
    quantity: params.quantity,
    filledQuantity: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // 添加到订单列表开头
  MOCK_ORDERS.unshift(newOrder);
  
  // 模拟返回
  return {
    success: true,
    orderId,
    message: '订单已提交',
  };
}

// 撤单接口（预留）
export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  // TODO: 对接柜台 API
  console.log('📤 [预留接口] 撤销订单:', orderId);
  
  return {
    success: true,
    message: '订单已撤销（模拟）',
  };
}

// 获取账户信息（预留）
export async function getAccountInfo(): Promise<AccountBalance> {
  // TODO: 对接柜台 API
  console.log('📤 [预留接口] 获取账户信息');
  return MOCK_ACCOUNT;
}

// 获取持仓（预留）
export async function getPositions(): Promise<Position[]> {
  // TODO: 对接柜台 API
  console.log('📤 [预留接口] 获取持仓');
  return MOCK_POSITIONS;
}

// 获取订单列表（预留）
export async function getOrders(): Promise<Order[]> {
  // TODO: 对接柜台 API
  console.log('📤 [预留接口] 获取订单列表');
  return MOCK_ORDERS;
}
