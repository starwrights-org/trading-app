# Trading App - 同舟证券交易系统

长桥风格的港美股交易 Web 应用

## 🔗 链接

- **在线预览**: https://starwrights-org.github.io/trading-app/
- **GitHub**: https://github.com/starwrights-org/trading-app

## 📱 功能概览

### 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 自选股、涨跌榜、账户概览 |
| 搜索 | `/search` | 股票搜索（8,493只） |
| 个股详情 | `/stock/[market]/[symbol]` | K线、窝轮、简况、资讯 |
| 持仓 | `/positions` | 持仓列表、盈亏显示 |
| 订单 | `/orders` | 今日/历史订单 |
| 市场 | `/market` | 发现、市场、基金、北向通 |
| 动态 | `/news` | 头条、7x24、热榜、机构 |
| 交易大厅 | `/trading-hall` | 股票搜索下单 |
| 全部功能 | `/all-functions` | 功能入口汇总 |
| 我的 | `/account` | 用户中心 |

### 核心功能

#### 股票数据
- **8,493 只**股票（港股 4,850 + 美股 3,600 + 窝轮 2,000）
- 长桥 API 实时/延迟行情
- K线图表（ECharts）
- 中文别名搜索

#### 港股特色
- 窝轮牛熊证列表（认购/认沽/牛证/熊证）
- 每手股数（从长桥 API 获取）
- 24只热门港股窝轮数据

#### 交易功能
- 股票搜索下单
- 限价单/市价单
- 买入/卖出
- 预估金额计算

## 🛠️ 技术栈

- **框架**: Next.js 16
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: ECharts
- **部署**: GitHub Pages (静态导出)
- **数据**: 长桥 API

## 📂 项目结构

```
trading-app/
├── src/
│   ├── app/                    # 页面
│   │   ├── page.tsx           # 首页
│   │   ├── search/            # 搜索
│   │   ├── stock/[market]/[symbol]/  # 个股详情
│   │   ├── positions/         # 持仓
│   │   ├── orders/            # 订单
│   │   ├── market/            # 市场
│   │   ├── news/              # 动态
│   │   ├── trading-hall/      # 交易大厅
│   │   ├── all-functions/     # 全部功能
│   │   └── account/           # 我的
│   ├── components/            # 组件
│   │   ├── BottomNav.tsx     # 底部导航
│   │   └── KlineChart.tsx    # K线图表
│   └── lib/                   # 工具
│       ├── mockData.ts       # 模拟数据
│       ├── theme.ts          # 主题系统
│       └── types.ts          # 类型定义
├── public/
│   └── data/
│       ├── stocks.json       # 股票数据库 (8,493只)
│       ├── kline/            # K线数据 (44只)
│       └── warrants/         # 窝轮数据 (24只)
├── scripts/
│   ├── update_prices.py      # 批量更新价格
│   ├── fetch_kline.py        # 获取K线数据
│   └── fetch_warrants.py     # 获取窝轮数据
└── README.md
```

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npx serve out
```

## 📊 数据更新

### 更新股票价格
```bash
cd scripts
python3 update_prices.py
```

### 更新K线数据
```bash
python3 fetch_kline.py
```

### 更新窝轮数据
```bash
python3 fetch_warrants.py
```

## 🔑 长桥 API

凭证位置: `/home/ubuntu/.openclaw/workspace-fintech/check_premarket.py`

数据权限:
- 美股: Nasdaq Basic (实时)
- 港股: 15分钟延迟
- A股: 15分钟延迟

## 📝 更新日志

### 2026-03-21
- ✅ 项目初始化，13个页面完成
- ✅ 长桥 API 集成
- ✅ 股票数据库扩充至 8,493 只
- ✅ K线图表（ECharts）
- ✅ 窝轮牛熊证功能
- ✅ 港股每手股数
- ✅ 交易大厅股票搜索
- ✅ 「我的」页面重做

---

**开发者**: Kuro-OPC Team  
**客户**: 同舟证券
