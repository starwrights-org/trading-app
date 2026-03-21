import { Stock, Position, Order, AccountBalance, Kline } from './types';

// 实时股票数据 - 2026-03-21 更新
export const MOCK_STOCKS: Stock[] = [
  // 港股 - Google Finance 实时数据
  { symbol: '00700', name: '腾讯控股', nameEn: 'Tencent', market: 'HK', price: 508.00, change: -3.00, changePercent: -0.59, open: 511, high: 515, low: 506, prevClose: 511, volume: 12854094, pe: 19.2 },
  { symbol: '09988', name: '阿里巴巴-SW', nameEn: 'Alibaba', market: 'HK', price: 123.70, change: -1.80, changePercent: -1.43, open: 125, high: 126.5, low: 122.8, prevClose: 125.5, volume: 28678432, pe: 15.8 },
  { symbol: '03690', name: '美团-W', nameEn: 'Meituan', market: 'HK', price: 79.15, change: -2.35, changePercent: -2.88, open: 81, high: 82, low: 78.5, prevClose: 81.5, volume: 21234567, pe: 35.6 },
  { symbol: '01810', name: '小米集团-W', nameEn: 'Xiaomi', market: 'HK', price: 33.20, change: -0.80, changePercent: -2.35, open: 34, high: 34.5, low: 32.9, prevClose: 34, volume: 95234567, pe: 22.4 },
  { symbol: '00388', name: '香港交易所', nameEn: 'HKEX', market: 'HK', price: 396.00, change: 6.00, changePercent: 1.54, open: 390, high: 398, low: 388, prevClose: 390, volume: 4156789, pe: 38.5 },
  { symbol: '02318', name: '中国平安', nameEn: 'Ping An', market: 'HK', price: 41.85, change: -0.65, changePercent: -1.53, open: 42.5, high: 43, low: 41.5, prevClose: 42.5, volume: 52678901, pe: 7.8 },
  
  // 美股 - Google Finance 实时数据
  { symbol: 'AAPL', name: '苹果', nameEn: 'Apple', market: 'US', price: 247.99, change: -0.97, changePercent: -0.39, open: 248.5, high: 250.2, low: 246.8, prevClose: 248.96, volume: 32428002, pe: 31.2 },
  { symbol: 'NVDA', name: '英伟达', nameEn: 'NVIDIA', market: 'US', price: 172.93, change: -5.63, changePercent: -3.15, open: 176, high: 177.5, low: 171.5, prevClose: 178.56, volume: 168525509, pe: 35.1 },
  { symbol: 'TSLA', name: '特斯拉', nameEn: 'Tesla', market: 'US', price: 367.96, change: 142.65, changePercent: 63.33, open: 240, high: 372, low: 238, prevClose: 225.31, volume: 285765432, pe: 142.5 },
  { symbol: 'AMZN', name: '亚马逊', nameEn: 'Amazon', market: 'US', price: 205.37, change: -3.39, changePercent: -1.62, open: 207, high: 208.5, low: 204.2, prevClose: 208.76, volume: 38995364, pe: 28.5 },
  { symbol: 'GOOGL', name: '谷歌', nameEn: 'Alphabet', market: 'US', price: 301.00, change: -6.13, changePercent: -2.00, open: 305, high: 306.5, low: 299.5, prevClose: 307.13, volume: 25623215, pe: 27.8 },
  { symbol: 'META', name: 'Meta', nameEn: 'Meta Platforms', market: 'US', price: 593.66, change: -13.04, changePercent: -2.15, open: 602, high: 605, low: 590, prevClose: 606.70, volume: 13568305, pe: 20.2 },
];

// Mock 持仓数据 - 更新价格
export const MOCK_POSITIONS: Position[] = [
  { symbol: '00700', name: '腾讯控股', market: 'HK', quantity: 200, availableQuantity: 200, costPrice: 480.50, currentPrice: 508.00, marketValue: 101600, profitLoss: 5500, profitLossPercent: 5.72 },
  { symbol: 'NVDA', name: '英伟达', market: 'US', quantity: 50, availableQuantity: 50, costPrice: 165.20, currentPrice: 172.93, marketValue: 8646.50, profitLoss: 386.50, profitLossPercent: 4.68 },
  { symbol: 'AAPL', name: '苹果', market: 'US', quantity: 100, availableQuantity: 100, costPrice: 235.00, currentPrice: 247.99, marketValue: 24799, profitLoss: 1299, profitLossPercent: 5.53 },
];

// Mock 订单数据
export const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', symbol: '00700', name: '腾讯控股', market: 'HK', side: 'buy', orderType: 'limit', price: 500, quantity: 100, filledQuantity: 100, filledPrice: 499.80, status: 'filled', createdAt: '2026-03-21T09:30:00Z', updatedAt: '2026-03-21T09:30:15Z' },
  { id: 'ORD002', symbol: 'NVDA', name: '英伟达', market: 'US', side: 'buy', orderType: 'limit', price: 170, quantity: 30, filledQuantity: 0, status: 'pending', createdAt: '2026-03-21T09:35:00Z', updatedAt: '2026-03-21T09:35:00Z' },
  { id: 'ORD003', symbol: 'TSLA', name: '特斯拉', market: 'US', side: 'sell', orderType: 'market', quantity: 20, filledQuantity: 20, filledPrice: 365.10, status: 'filled', createdAt: '2026-03-20T22:15:00Z', updatedAt: '2026-03-20T22:15:03Z' },
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
  // TODO: 对接行情 API（长桥/Yahoo Finance）
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
