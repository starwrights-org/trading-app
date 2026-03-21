// 股票信息
export interface Stock {
  symbol: string;       // 股票代码
  name: string;         // 股票名称
  nameEn?: string;      // 英文名称
  market: 'HK' | 'US';  // 市场
  price: number;        // 当前价格
  change: number;       // 涨跌额
  changePercent: number; // 涨跌幅
  open?: number;        // 开盘价
  high?: number;        // 最高价
  low?: number;         // 最低价
  prevClose?: number;   // 昨收
  volume?: number;      // 成交量
  turnover?: number;    // 成交额
  marketCap?: number;   // 市值
  pe?: number;          // 市盈率
  bid?: number;         // 买一价
  ask?: number;         // 卖一价
  bidSize?: number;     // 买一量
  askSize?: number;     // 卖一量
}

// 订单
export interface Order {
  id: string;
  symbol: string;
  name: string;
  market: 'HK' | 'US';
  side: 'buy' | 'sell';        // 买/卖
  orderType: 'limit' | 'market' | 'stop'; // 订单类型
  price?: number;              // 委托价格
  quantity: number;            // 委托数量
  filledQuantity: number;      // 成交数量
  filledPrice?: number;        // 成交均价
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// 持仓
export interface Position {
  symbol: string;
  name: string;
  market: 'HK' | 'US';
  quantity: number;            // 持仓数量
  availableQuantity: number;   // 可卖数量
  costPrice: number;           // 成本价
  currentPrice: number;        // 当前价
  marketValue: number;         // 市值
  profitLoss: number;          // 盈亏
  profitLossPercent: number;   // 盈亏比例
}

// 账户资金
export interface AccountBalance {
  currency: 'HKD' | 'USD' | 'CNY';
  totalAssets: number;         // 总资产
  cashBalance: number;         // 现金余额
  marketValue: number;         // 证券市值
  buyingPower: number;         // 购买力
  frozenCash: number;          // 冻结资金
  todayProfitLoss: number;     // 今日盈亏
  totalProfitLoss: number;     // 累计盈亏
}

// 自选股分组
export interface Watchlist {
  id: string;
  name: string;
  stocks: string[];  // symbol 列表
}

// K线数据
export interface Kline {
  time: number;      // 时间戳
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 买卖盘
export interface OrderBook {
  bids: { price: number; volume: number }[];  // 买盘
  asks: { price: number; volume: number }[];  // 卖盘
}

// 订单类型选项
export const ORDER_TYPES = {
  limit: '限价单',
  market: '市价单',
  stop: '止损单',
} as const;

// 订单状态
export const ORDER_STATUS = {
  pending: '待成交',
  partial: '部分成交',
  filled: '已成交',
  cancelled: '已撤销',
  rejected: '已拒绝',
} as const;

// 市场信息
export const MARKETS = {
  HK: { name: '港股', currency: 'HKD', tradingHours: '09:30-16:00' },
  US: { name: '美股', currency: 'USD', tradingHours: '21:30-04:00' },
} as const;
