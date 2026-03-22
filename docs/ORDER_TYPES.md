# 港股与美股订单类型及价格档位研究

## 港股订单类型

### 一、开市前时段 & 收市竞价时段

#### 1. 竞价盘 (Auction Order)
- **特点**: 没有指定价格
- **执行**: 按最终参考平衡价格进行对盘
- **优先级**: 享有较竞价限价盘优先的对盘次序
- **未完成处理**: 开市前时段结束后自动取消

#### 2. 竞价限价盘 (Auction Limit Order)
- **特点**: 有指定价格
- **执行**: 指定价格等同或优于最终参考平衡价格时可对盘
- **未完成处理**: 转至持续交易时段，视为限价盘

---

### 二、持续交易时段

#### 3. 限价盘 (Limit Order)
- **特点**: 只可以指定价格配对
- **限制**: 
  - 沽盘输入价格不可低于最佳买入价
  - 买盘输入价格不可高于最佳沽出价
- **未完成处理**: 存于所输入价格的轮候队伍中

#### 4. 增强限价盘 (Enhanced Limit Order)
- **特点**: 最多可同时与10条轮候队伍配对
- **限制**: 
  - 沽盘价格不可低于最佳买入价10个价位
  - 买盘价格不可高于最佳沽出价10个价位
- **未完成处理**: 视为限价盘，存于所输入价格的轮候队伍中
- **适用**: **港股通投资者在持续交易时段必须使用增强限价盘**

#### 5. 特别限价盘 (Special Limit Order)
- **特点**: 最多可同时与10条轮候队伍配对
- **价格限制**: 无输入价格限制（只要沽盘≤最佳买入价，买盘≥最佳沽出价）
- **未完成处理**: **自动取消**，不会保留在系统内

---

### 三、附加指示

#### 全数执行或立刻取消 (Fill or Kill - FOK)
- 如不能同时全数完成，便取消整个买盖盘

---

## 美股订单类型

### 基础订单类型

#### 1. 市价单 (Market Order)
- **特点**: 不指定价格，以当前市场最优价格成交
- **优点**: 几乎保证成交
- **缺点**: 成交价格不确定

#### 2. 限价单 (Limit Order)
- **特点**: 指定价格或更优价格成交
- **买入**: 成交价 ≤ 限价
- **卖出**: 成交价 ≥ 限价
- **优点**: 控制成交价格
- **缺点**: 可能无法成交

### 条件订单

#### 3. 止损单 (Stop Order / Stop Loss)
- **特点**: 当市场价格达到止损价时，转为市价单执行
- **买入止损**: 市价 ≥ 止损价 → 触发
- **卖出止损**: 市价 ≤ 止损价 → 触发

#### 4. 止损限价单 (Stop Limit Order)
- **特点**: 当市场价格达到止损价时，转为限价单
- **参数**: 止损价 + 限价

#### 5. 跟踪止损单 (Trailing Stop Order)
- **特点**: 止损价随市场价格移动
- **参数**: 跟踪金额或百分比
- **示例**: 跟踪$2，股价从$50涨到$55，止损价从$48涨到$53

### 时效指令

| 类型 | 说明 |
|------|------|
| **DAY** | 当日有效，收盘自动取消 |
| **GTC** | Good Till Cancelled，长期有效直到成交或取消 |
| **IOC** | Immediate or Cancel，立即成交否则取消 |
| **FOK** | Fill or Kill，全部成交否则全部取消 |
| **MOO** | Market on Open，开盘时以市价执行 |
| **MOC** | Market on Close，收盘时以市价执行 |
| **LOO** | Limit on Open，开盘时以限价执行 |
| **LOC** | Limit on Close，收盘时以限价执行 |

---

## 港股价格档位 (Spread Table)

港股价格档位根据港交所最新规则 (2024年调整后)：

| 股价范围 (HKD) | 最小变动价位 |
|----------------|-------------|
| 0.01 - 0.25 | $0.001 |
| 0.25 - 0.50 | $0.005 |
| 0.50 - 10.00 | $0.010 |
| 10.00 - 20.00 | $0.010 |
| 20.00 - 50.00 | $0.020 |
| 50.00 - 100.00 | $0.050 |
| 100.00 - 200.00 | $0.100 |
| 200.00 - 1,000.00 | $0.500 |
| 1,000.00 - 9,995.00 | $2.500 |

### 示例
- 腾讯 $500.00 → 最小变动 $0.500 (可输入 500.0, 500.5, 501.0...)
- 汇丰 $65.00 → 最小变动 $0.050 (可输入 65.00, 65.05, 65.10...)
- 中海油 $30.00 → 最小变动 $0.020 (可输入 30.00, 30.02, 30.04...)

---

## 美股价格档位

美股价格档位相对简单：

| 股价 | 最小变动价位 |
|------|-------------|
| ≥ $1.00 | $0.01 |
| < $1.00 | $0.0001 |

### 特殊情况
- 期权: $0.01 或 $0.05（取决于期权价格）
- ETF: 部分支持更小价位

---

## 交易系统实现建议

### 1. 订单类型选择器
```typescript
// 港股订单类型
type HKOrderType = 
  | 'enhanced_limit'  // 增强限价盘（港股通必须用）
  | 'limit'           // 限价盘
  | 'auction_limit'   // 竞价限价盘
  | 'auction'         // 竞价盘
  | 'special_limit';  // 特别限价盘

// 美股订单类型
type USOrderType = 
  | 'market'          // 市价单
  | 'limit'           // 限价单
  | 'stop'            // 止损单
  | 'stop_limit'      // 止损限价单
  | 'trailing_stop';  // 跟踪止损单

// 时效类型
type TimeInForce = 'DAY' | 'GTC' | 'IOC' | 'FOK';
```

### 2. 价格档位函数
```typescript
function getHKSpread(price: number): number {
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

function getUSSpread(price: number): number {
  return price >= 1 ? 0.01 : 0.0001;
}
```

### 3. 价格验证
```typescript
function validatePrice(price: number, market: 'HK' | 'US'): boolean {
  const spread = market === 'HK' ? getHKSpread(price) : getUSSpread(price);
  const remainder = price % spread;
  return Math.abs(remainder) < 0.0000001; // 浮点数精度处理
}
```

---

## 参考来源

1. 香港交易所官网 - 交易机制
   https://www.hkex.com.hk/Services/Trading/Securities/Overview/Trading-Mechanism

2. 香港交易所规则附表二 - 价位表
   https://www.hkex.com.hk/-/media/HKEX-Market/Services/Rules-and-Forms-and-Fees/Rules/SEHK/Securities/Rules/Sch_02.pdf

3. 港股通投资者教育

---

**文档创建**: 2026-03-21
**作者**: FinTech 💰
