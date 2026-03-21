import { Stock, Position, Order, AccountBalance, Kline } from './types';

// Mock 股票数据
export const MOCK_STOCKS: Stock[] = [
  // 港股
  { symbol: '00700', name: '腾讯控股', nameEn: 'Tencent', market: 'HK', price: 511.00, change: -2.00, changePercent: -0.39, open: 505, high: 519, low: 505, prevClose: 513, volume: 13254094, pe: 19.54 },
  { symbol: '09988', name: '阿里巴巴-SW', nameEn: 'Alibaba', market: 'HK', price: 138.50, change: 2.30, changePercent: 1.69, open: 136, high: 140, low: 135.5, prevClose: 136.2, volume: 25678432, pe: 22.3 },
  { symbol: '03690', name: '美团-W', nameEn: 'Meituan', market: 'HK', price: 168.20, change: -1.80, changePercent: -1.06, open: 170, high: 172, low: 167, prevClose: 170, volume: 18234567, pe: 45.2 },
  { symbol: '01810', name: '小米集团-W', nameEn: 'Xiaomi', market: 'HK', price: 42.85, change: 0.95, changePercent: 2.27, open: 42, high: 43.5, low: 41.8, prevClose: 41.9, volume: 89234567, pe: 28.5 },
  { symbol: '00388', name: '香港交易所', nameEn: 'HKEX', market: 'HK', price: 285.60, change: -3.40, changePercent: -1.18, open: 288, high: 290, low: 284, prevClose: 289, volume: 3456789, pe: 32.1 },
  { symbol: '02318', name: '中国平安', nameEn: 'Ping An', market: 'HK', price: 45.30, change: 0.25, changePercent: 0.55, open: 45, high: 45.8, low: 44.9, prevClose: 45.05, volume: 45678901, pe: 8.9 },
  // 美股
  { symbol: 'AAPL', name: '苹果', nameEn: 'Apple', market: 'US', price: 248.96, change: -0.98, changePercent: -0.39, open: 249.4, high: 251.83, low: 247.3, prevClose: 249.94, volume: 30428002, pe: 31.63 },
  { symbol: 'NVDA', name: '英伟达', nameEn: 'NVIDIA', market: 'US', price: 178.56, change: -1.84, changePercent: -1.02, open: 178.01, high: 179.98, low: 175.79, prevClose: 180.4, volume: 156525509, pe: 36.43 },
  { symbol: 'TSLA', name: '特斯拉', nameEn: 'Tesla', market: 'US', price: 225.31, change: 5.67, changePercent: 2.58, open: 220, high: 228, low: 218.5, prevClose: 219.64, volume: 98765432, pe: 85.2 },
  { symbol: 'AMZN', name: '亚马逊', nameEn: 'Amazon', market: 'US', price: 208.76, change: -1.11, changePercent: -0.53, open: 207.06, high: 209.12, low: 206.05, prevClose: 209.87, volume: 33995364, pe: 29.11 },
  { symbol: 'GOOGL', name: '谷歌', nameEn: 'Alphabet', market: 'US', price: 307.13, change: -0.56, changePercent: -0.18, open: 304.01, high: 308.06, low: 302.35, prevClose: 307.69, volume: 22623215, pe: 28.41 },
  { symbol: 'META', name: 'Meta', nameEn: 'Meta Platforms', market: 'US', price: 606.70, change: -8.98, changePercent: -1.46, open: 612.15, high: 613, low: 602.26, prevClose: 615.68, volume: 11568305, pe: 20.76 },
];

// Mock 持仓数据
export const MOCK_POSITIONS: Position[] = [
  { symbol: '00700', name: '腾讯控股', market: 'HK', quantity: 200, availableQuantity: 200, costPrice: 480.50, currentPrice: 511.00, marketValue: 102200, profitLoss: 6100, profitLossPercent: 6.35 },
  { symbol: 'NVDA', name: '英伟达', market: 'US', quantity: 50, availableQuantity: 50, costPrice: 165.20, currentPrice: 178.56, marketValue: 8928, profitLoss: 668, profitLossPercent: 8.08 },
  { symbol: 'AAPL', name: '苹果', market: 'US', quantity: 100, availableQuantity: 100, costPrice: 235.00, currentPrice: 248.96, marketValue: 24896, profitLoss: 1396, profitLossPercent: 5.94 },
];

// Mock 订单数据
export const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', symbol: '00700', name: '腾讯控股', market: 'HK', side: 'buy', orderType: 'limit', price: 500, quantity: 100, filledQuantity: 100, filledPrice: 499.80, status: 'filled', createdAt: '2026-03-21T09:30:00Z', updatedAt: '2026-03-21T09:30:15Z' },
  { id: 'ORD002', symbol: 'NVDA', name: '英伟达', market: 'US', side: 'buy', orderType: 'limit', price: 175, quantity: 30, filledQuantity: 0, status: 'pending', createdAt: '2026-03-21T09:35:00Z', updatedAt: '2026-03-21T09:35:00Z' },
  { id: 'ORD003', symbol: 'TSLA', name: '特斯拉', market: 'US', side: 'sell', orderType: 'market', quantity: 20, filledQuantity: 20, filledPrice: 225.10, status: 'filled', createdAt: '2026-03-20T22:15:00Z', updatedAt: '2026-03-20T22:15:03Z' },
];

// Mock 账户数据
export const MOCK_ACCOUNT: AccountBalance = {
  currency: 'HKD',
  totalAssets: 1250680.50,
  cashBalance: 350000.00,
  marketValue: 900680.50,
  buyingPower: 700000.00,
  frozenCash: 50000.00,
  todayProfitLoss: 12580.00,
  totalProfitLoss: 85600.00,
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

// ============ 预留 API 接口 ============

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
  
  // 模拟返回
  return {
    success: true,
    orderId: 'ORD' + Date.now(),
    message: '订单已提交（模拟）',
  };
}

// 撤单接口（预留）
export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  // TODO: 对接柜台 API
  console.log('📤 [预留接口] 撤销订单:', orderId);
  
  return {
    success: true,
    message: '撤单成功（模拟）',
  };
}

// 获取实时行情（预留）
export async function getQuote(symbol: string): Promise<Stock | null> {
  // TODO: 对接行情 API
  console.log('📤 [预留接口] 获取行情:', symbol);
  
  return getStock(symbol) || null;
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
  console.log('📤 [预留接口] 获取订单');
  
  return MOCK_ORDERS;
}
