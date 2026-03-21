// 解析 NASDAQ 数据并生成股票数据库
const fs = require('fs');

// 读取 NASDAQ 数据
const nasdaqData = JSON.parse(fs.readFileSync('nasdaq_stocks.json', 'utf8'));
const nyseData = JSON.parse(fs.readFileSync('nyse_stocks.json', 'utf8'));

// 合并美股数据
const usStocks = [];
const seen = new Set();

function processStock(row, exchange) {
  if (seen.has(row.symbol)) return;
  seen.add(row.symbol);
  
  // 解析价格
  const price = parseFloat(row.lastsale?.replace('$', '').replace(',', '') || 0);
  const change = parseFloat(row.pctchange?.replace('%', '') || 0);
  const marketCap = parseFloat(row.marketCap || 0);
  
  // 过滤掉价格为0或市值太小的
  if (price <= 0 || marketCap < 100000000) return; // 市值 > 1亿美元
  
  usStocks.push({
    symbol: row.symbol,
    name: row.name?.replace(/ Common Stock.*$/, '').replace(/ Class [A-Z].*$/, '').trim(),
    market: 'US',
    exchange: exchange,
    price: price,
    changePercent: change,
    marketCap: marketCap,
    sector: row.sector || '',
    industry: row.industry || '',
    country: row.country || 'United States'
  });
}

// 处理 NASDAQ
nasdaqData.data?.rows?.forEach(row => processStock(row, 'NASDAQ'));

// 处理 NYSE
nyseData.data?.rows?.forEach(row => processStock(row, 'NYSE'));

// 按市值排序
usStocks.sort((a, b) => b.marketCap - a.marketCap);

console.log(`美股总数: ${usStocks.length}`);
console.log(`前10大市值股票:`);
usStocks.slice(0, 10).forEach((s, i) => {
  console.log(`${i+1}. ${s.symbol} - ${s.name} - $${(s.marketCap/1e9).toFixed(1)}B`);
});

// 保存美股数据
fs.writeFileSync('us_stocks.json', JSON.stringify(usStocks, null, 2));
console.log(`\n已保存到 us_stocks.json`);

// 生成精简版（用于前端）
const usStocksLite = usStocks.slice(0, 3000).map(s => ({
  symbol: s.symbol,
  name: s.name,
  market: 'US',
  sector: s.sector
}));
fs.writeFileSync('us_stocks_lite.json', JSON.stringify(usStocksLite));
console.log(`精简版已保存到 us_stocks_lite.json (${usStocksLite.length} 只)`);
