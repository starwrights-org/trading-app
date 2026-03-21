const fs = require('fs');

// 股票中英文别名映射
const ALIASES = {
  // 美股中概股
  'BABA': '阿里巴巴',
  'JD': '京东',
  'PDD': '拼多多',
  'NTES': '网易',
  'BIDU': '百度',
  'BILI': '哔哩哔哩 B站',
  'NIO': '蔚来',
  'XPEV': '小鹏汽车',
  'LI': '理想汽车',
  'TME': '腾讯音乐',
  'IQ': '爱奇艺',
  'TCOM': '携程',
  'ZTO': '中通快递',
  'EDU': '新东方',
  'TAL': '好未来',
  'VNET': '世纪互联',
  'WB': '微博',
  'FUTU': '富途',
  'TIGR': '老虎证券',
  'YMM': '满帮',
  'DIDI': '滴滴',
  'QFIN': '奇富科技 360数科',
  'KC': '金山云',
  'HTHT': '华住集团',
  'ZH': '知乎',
  'DOYU': '斗鱼',
  'HUYA': '虎牙',
  'FINV': '信也科技',
  'LX': '乐信',
  'BZUN': '宝尊电商',
  'DQ': '大全新能源',
  'JKS': '晶科能源',
  
  // 美股科技股
  'NVDA': '英伟达',
  'AAPL': '苹果',
  'MSFT': '微软',
  'GOOGL': '谷歌',
  'GOOG': '谷歌',
  'AMZN': '亚马逊',
  'META': '脸书 Meta',
  'TSLA': '特斯拉',
  'AMD': '超微半导体',
  'INTC': '英特尔',
  'QCOM': '高通',
  'AVGO': '博通',
  'MU': '美光',
  'NFLX': '奈飞 Netflix',
  'CRM': 'Salesforce',
  'ORCL': '甲骨文',
  'ADBE': 'Adobe',
  'CSCO': '思科',
  'IBM': 'IBM',
  'PYPL': 'PayPal 贝宝',
  'SQ': 'Block 方块',
  'SHOP': 'Shopify',
  'SNOW': 'Snowflake',
  'PLTR': 'Palantir',
  'COIN': 'Coinbase',
  'UBER': '优步',
  'LYFT': 'Lyft',
  'ABNB': '爱彼迎 Airbnb',
  'DASH': 'DoorDash',
  'SPOT': 'Spotify',
  'PINS': 'Pinterest',
  'SNAP': 'Snapchat',
  'TWTR': '推特',
  'ZM': 'Zoom',
  'DOCU': 'DocuSign',
  'OKTA': 'Okta',
  'CRWD': 'CrowdStrike',
  'PANW': 'Palo Alto',
  'ZS': 'Zscaler',
  'DDOG': 'Datadog',
  'NET': 'Cloudflare',
  'MDB': 'MongoDB',
  'TWLO': 'Twilio',
  'U': 'Unity',
  'RBLX': 'Roblox',
  
  // 美股金融
  'JPM': '摩根大通',
  'BAC': '美国银行',
  'WFC': '富国银行',
  'C': '花旗',
  'GS': '高盛',
  'MS': '摩根士丹利',
  'V': 'Visa',
  'MA': '万事达',
  'AXP': '美国运通',
  'BRK.A': '伯克希尔',
  'BRK.B': '伯克希尔',
  'BLK': '贝莱德',
  'SCHW': '嘉信理财',
  
  // 美股消费
  'WMT': '沃尔玛',
  'COST': 'Costco 好市多',
  'TGT': 'Target',
  'HD': '家得宝',
  'LOW': '劳氏',
  'NKE': '耐克',
  'SBUX': '星巴克',
  'MCD': '麦当劳',
  'KO': '可口可乐',
  'PEP': '百事',
  'PG': '宝洁',
  'JNJ': '强生',
  'UNH': '联合健康',
  'PFE': '辉瑞',
  'MRNA': 'Moderna',
  'LLY': '礼来',
  'ABBV': '艾伯维',
  'MRK': '默沙东',
  
  // 美股能源
  'XOM': '埃克森美孚',
  'CVX': '雪佛龙',
  'COP': '康菲石油',
  'SLB': '斯伦贝谢',
  
  // 美股 ETF
  'SPY': '标普500ETF',
  'QQQ': '纳指100ETF',
  'IWM': '罗素2000ETF',
  'DIA': '道指ETF',
  'VTI': '全美股票ETF',
  'VOO': '先锋标普500',
  'ARKK': 'ARK创新ETF',
  'KWEB': '中概互联网ETF',
  'FXI': '中国大盘ETF',
  'MCHI': '中国ETF',
  'EEM': '新兴市场ETF',
  'GLD': '黄金ETF',
  'SLV': '白银ETF',
  'USO': '原油ETF',
  'TLT': '20年国债ETF',
  'HYG': '高收益债ETF',
  'XLF': '金融板块ETF',
  'XLK': '科技板块ETF',
  'XLE': '能源板块ETF',
  'XLV': '医疗板块ETF',
  'QQQM': '纳指100迷你ETF',
  'SPYM': '标普500迷你ETF',
  
  // 台积电
  'TSM': '台积电',
};

// 读取现有数据
const stocks = JSON.parse(fs.readFileSync('../public/data/stocks.json', 'utf8'));

// 添加别名
let updated = 0;
stocks.forEach(stock => {
  if (ALIASES[stock.symbol]) {
    stock.alias = ALIASES[stock.symbol];
    updated++;
  }
});

console.log(`已添加 ${updated} 个中文别名`);

// 保存
fs.writeFileSync('../public/data/stocks.json', JSON.stringify(stocks, null, 2));
console.log('已保存到 stocks.json');

// 验证
const baba = stocks.find(s => s.symbol === 'BABA');
console.log('BABA:', baba);
