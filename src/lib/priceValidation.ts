/**
 * 港股/美股价格档位验证工具
 * 
 * 港股价格档位 (Spread Table) - 根据港交所规则
 * 美股价格档位 - 统一 $0.01 (股价≥$1) 或 $0.0001 (股价<$1)
 */

/**
 * 获取港股最小变动价位
 * @param price 当前价格
 * @returns 最小变动价位
 */
export function getHKSpread(price: number): number {
  if (price < 0.25) return 0.001;
  if (price < 0.50) return 0.005;
  if (price < 10) return 0.01;
  if (price < 20) return 0.02;
  if (price < 100) return 0.05;
  if (price < 200) return 0.10;
  if (price < 500) return 0.20;
  if (price < 1000) return 0.50;
  if (price < 2000) return 1.00;
  if (price < 5000) return 2.00;
  return 5.00;
}

/**
 * 获取美股最小变动价位
 * @param price 当前价格
 * @returns 最小变动价位
 */
export function getUSSpread(price: number): number {
  return price >= 1 ? 0.01 : 0.0001;
}

/**
 * 获取价格档位
 * @param price 当前价格
 * @param market 市场 (HK/US)
 * @returns 最小变动价位
 */
export function getSpread(price: number, market: 'HK' | 'US'): number {
  return market === 'HK' ? getHKSpread(price) : getUSSpread(price);
}

/**
 * 验证价格是否符合档位要求
 * @param price 输入价格
 * @param market 市场 (HK/US)
 * @returns 验证结果
 */
export function validatePrice(price: number, market: 'HK' | 'US'): {
  valid: boolean;
  spread: number;
  correctedPrice?: number;
  message?: string;
} {
  if (isNaN(price) || price <= 0) {
    return {
      valid: false,
      spread: 0,
      message: '请输入有效价格'
    };
  }

  const spread = getSpread(price, market);
  
  // 使用精确的小数计算避免浮点数误差
  const decimals = getDecimals(spread);
  const multiplier = Math.pow(10, decimals);
  const priceInt = Math.round(price * multiplier);
  const spreadInt = Math.round(spread * multiplier);
  
  const remainder = priceInt % spreadInt;
  
  if (remainder === 0) {
    return {
      valid: true,
      spread
    };
  }
  
  // 计算修正后的价格（向下取整到最近档位）
  const correctedPriceInt = priceInt - remainder;
  const correctedPrice = correctedPriceInt / multiplier;
  
  const marketName = market === 'HK' ? '港股' : '美股';
  
  return {
    valid: false,
    spread,
    correctedPrice,
    message: `${marketName}价格档位为 ${formatSpread(spread)}，请输入如 ${formatPrice(correctedPrice)} 或 ${formatPrice(correctedPrice + spread)}`
  };
}

/**
 * 将价格修正到最近的有效档位
 * @param price 输入价格
 * @param market 市场 (HK/US)
 * @param direction 修正方向 ('down' | 'up' | 'nearest')
 * @returns 修正后的价格
 */
export function correctPrice(price: number, market: 'HK' | 'US', direction: 'down' | 'up' | 'nearest' = 'nearest'): number {
  const spread = getSpread(price, market);
  const decimals = getDecimals(spread);
  const multiplier = Math.pow(10, decimals);
  const priceInt = Math.round(price * multiplier);
  const spreadInt = Math.round(spread * multiplier);
  
  const remainder = priceInt % spreadInt;
  
  if (remainder === 0) {
    return price;
  }
  
  const lowerPrice = (priceInt - remainder) / multiplier;
  const upperPrice = (priceInt - remainder + spreadInt) / multiplier;
  
  switch (direction) {
    case 'down':
      return lowerPrice;
    case 'up':
      return upperPrice;
    case 'nearest':
    default:
      return (remainder < spreadInt / 2) ? lowerPrice : upperPrice;
  }
}

/**
 * 格式化档位显示
 */
function formatSpread(spread: number): string {
  if (spread >= 1) return `$${spread.toFixed(0)}`;
  if (spread >= 0.01) return `$${spread.toFixed(2)}`;
  if (spread >= 0.001) return `$${spread.toFixed(3)}`;
  return `$${spread.toFixed(4)}`;
}

/**
 * 格式化价格显示
 */
function formatPrice(price: number): string {
  if (price >= 100) return price.toFixed(2);
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.1) return price.toFixed(3);
  return price.toFixed(4);
}

/**
 * 获取小数位数
 */
function getDecimals(num: number): number {
  const str = num.toString();
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) return 0;
  return str.length - decimalIndex - 1;
}

/**
 * 港股价格档位表（用于显示参考）
 */
export const HK_SPREAD_TABLE = [
  { min: 0.01, max: 0.25, spread: 0.001 },
  { min: 0.25, max: 0.50, spread: 0.005 },
  { min: 0.50, max: 10, spread: 0.01 },
  { min: 10, max: 20, spread: 0.02 },
  { min: 20, max: 100, spread: 0.05 },
  { min: 100, max: 200, spread: 0.10 },
  { min: 200, max: 500, spread: 0.20 },
  { min: 500, max: 1000, spread: 0.50 },
  { min: 1000, max: 2000, spread: 1.00 },
  { min: 2000, max: 5000, spread: 2.00 },
  { min: 5000, max: 9995, spread: 5.00 },
];
