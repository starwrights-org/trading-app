// 合并新浪港股数据
const fs = require('fs');

const allHkStocks = [];
const seen = new Set();

// 读取所有分页数据
for (let i = 1; i <= 40; i++) {
  try {
    const data = JSON.parse(fs.readFileSync(`sina_hk_page_${i}.json`, 'utf8'));
    if (Array.isArray(data)) {
      data.forEach(stock => {
        if (seen.has(stock.symbol)) return;
        seen.add(stock.symbol);
        
        allHkStocks.push({
          symbol: stock.symbol,
          name: stock.name,
          engname: stock.engname,
          market: 'HK',
          price: parseFloat(stock.lasttrade) || 0,
          changePercent: parseFloat(stock.changepercent) || 0
        });
      });
    }
  } catch (e) {
    console.log(`跳过 page ${i}: ${e.message}`);
  }
}

console.log(`港股总数: ${allHkStocks.length}`);

// 检查恒大汽车
const hengda = allHkStocks.find(s => s.symbol === '00708');
console.log(`恒大汽车 00708: ${hengda ? hengda.name : '未找到'}`);

// 保存完整港股数据
fs.writeFileSync('hk_stocks_full.json', JSON.stringify(allHkStocks, null, 2));
console.log(`已保存到 hk_stocks_full.json`);

// 精简版（用于前端搜索）
const hkStocksLite = allHkStocks.map(s => ({
  symbol: s.symbol,
  name: s.name,
  market: 'HK'
}));

// 读取美股数据
const usStocks = JSON.parse(fs.readFileSync('us_stocks_lite.json', 'utf8'));

// 合并
const allStocks = [...usStocks, ...hkStocksLite];
fs.writeFileSync('all_stocks.json', JSON.stringify(allStocks, null, 2));

console.log(`\n合并完成: ${allStocks.length} 只股票`);
console.log(`- 美股: ${usStocks.length}`);
console.log(`- 港股: ${hkStocksLite.length}`);

// 复制到 public
fs.copyFileSync('all_stocks.json', '../public/data/stocks.json');
console.log(`\n已更新 /public/data/stocks.json`);
