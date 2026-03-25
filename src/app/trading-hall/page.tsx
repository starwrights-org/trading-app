'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import { MOCK_POSITIONS } from '@/lib/mockData';

// 股票类型
interface Stock {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
  price?: number;
  lotSize?: number;
}

export default function TradingHallPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [stockCode, setStockCode] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  
  // 股票搜索相关
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 加载股票数据库
  useEffect(() => {
    fetch('/trading-app/data/stocks.json?v=20260321v7')
      .then(res => res.json())
      .then(data => setAllStocks(data))
      .catch(err => console.error('加载股票数据失败:', err));
  }, []);

  // 搜索股票 - 防抖处理
  const doSearch = useCallback((query: string) => {
    if (!query.trim() || query.length < 1 || allStocks.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const q = query.toLowerCase().trim();
    const results = allStocks
      .filter(s => 
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      )
      .slice(0, 10);
    
    setSearchResults(results);
    setShowResults(results.length > 0);
  }, [allStocks]);

  // 搜索防抖
  useEffect(() => {
    if (isComposing) return;
    if (selectedStock) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      doSearch(stockCode);
    }, 200);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [stockCode, isComposing, selectedStock, doSearch]);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 选择股票
  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setStockCode(`${stock.symbol} ${stock.name}`);
    setShowResults(false);
    if (stock.price) {
      setPrice(stock.price.toFixed(2));
    }
    const lotSize = stock.market === 'HK' ? (stock.lotSize || 100) : 1;
    setQuantity(String(lotSize));
  };

  // 清除选择
  const handleClearStock = () => {
    setSelectedStock(null);
    setStockCode('');
    setPrice('');
    setQuantity('');
  };

  // 计算预估金额
  const estimatedAmount = price && quantity ? (parseFloat(price) * parseInt(quantity)).toFixed(2) : '0.00';

  // 每手股数
  const lotSize = selectedStock 
    ? (selectedStock.market === 'HK' ? (selectedStock.lotSize || 100) : 1)
    : 100;

  // 货币
  const currency = selectedStock?.market === 'HK' ? 'HKD' : 'USD';

  // 是否可以下单
  const canSubmit = selectedStock && price && quantity && parseFloat(price) > 0 && parseInt(quantity) > 0;

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 ${colors.bg} border-b ${colors.borderLight}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/positions" className={`p-1 rounded-lg ${colors.hover} transition`}>
            <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedStock ? selectedStock.name : '交易大厅'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded-lg ${colors.hover} transition opacity-60`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button className={`p-1.5 rounded-lg ${colors.hover} transition opacity-60`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto animate-page-enter">
        {/* 账户选择 */}
        <div className={`px-4 py-3 flex items-center justify-between border-b ${colors.borderLight}`}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#C9A55C] rounded-md flex items-center justify-center text-white text-xs">💰</span>
            <span className="font-medium text-sm">证券账户 (LBPT10078568)</span>
          </div>
          <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>

        {/* 股票代码搜索 */}
        <div className={`px-4 py-4 border-b ${colors.borderLight}`} ref={searchRef}>
          <div className="flex items-center">
            <span className={`w-14 text-sm ${colors.textMuted}`}>股票</span>
            <div className="flex-1 relative">
              <div className={`flex items-center ${colors.input} rounded-xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#C9A55C]/30`}>
                <svg className="w-4 h-4 opacity-40 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={stockCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStockCode(val);
                    if (selectedStock) {
                      setSelectedStock(null);
                    }
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => {
                    setIsComposing(false);
                    doSearch(e.currentTarget.value);
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0 && !selectedStock) {
                      setShowResults(true);
                    }
                  }}
                  placeholder="输入股票代码或名称"
                  className={`flex-1 bg-transparent outline-none text-sm ${colors.text}`}
                />
                {selectedStock && (
                  <button onClick={handleClearStock} className="ml-2 opacity-40 hover:opacity-70 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* 搜索结果下拉 */}
              {showResults && (
                <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto animate-scale-enter ${isDark ? 'bg-[#1a2030] border border-[#2a3344]' : 'bg-white border border-[#e8e5df]'}`}>
                  {searchResults.map(stock => (
                    <button
                      key={`${stock.market}-${stock.symbol}`}
                      onClick={() => handleSelectStock(stock)}
                      className={`w-full px-4 py-3 text-left ${colors.hover} transition flex items-center justify-between`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.symbol}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-md ${stock.market === 'HK' ? 'bg-[#e74c3c]/15 text-[#e74c3c]' : 'bg-[#5B8FA8]/15 text-[#5B8FA8]'}`}>
                            {stock.market === 'HK' ? '港' : '美'}
                          </span>
                        </div>
                        <div className={`text-sm ${colors.textMuted}`}>{stock.name}</div>
                      </div>
                      {stock.price && (
                        <div className="text-right">
                          <div className="font-medium tabular-nums">{stock.price.toFixed(2)}</div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 已选股票提示 */}
          {selectedStock && (
            <div className={`mt-2 ml-14 text-sm ${isDark ? 'text-[#27ae60]' : 'text-[#27ae60]'} animate-fade-enter`}>
              ✓ {selectedStock.symbol} ({selectedStock.market === 'HK' ? '港股' : '美股'}) · 每手 {lotSize} 股
            </div>
          )}
        </div>

        {/* 订单类型 */}
        <div className={`px-4 py-3.5 border-b ${colors.borderLight}`}>
          <div className="flex items-center">
            <span className={`w-14 text-sm ${colors.textMuted}`}>类型</span>
            <div className={`flex-1 py-2 text-center rounded-xl ${colors.input} font-medium text-sm`}>
              {orderType === 'limit' ? '限价单' : '市价单'}
            </div>
          </div>
        </div>

        {/* 买卖方向 */}
        <div className={`px-4 py-3.5 border-b ${colors.borderLight}`}>
          <div className="flex items-center">
            <span className={`w-14 text-sm ${colors.textMuted}`}>方向</span>
            <div className="flex-1 flex">
              <button
                onClick={() => setDirection('buy')}
                className={`flex-1 py-2.5 rounded-l-xl font-medium text-sm transition-all ${
                  direction === 'buy'
                    ? 'bg-[#e74c3c] text-white shadow-sm'
                    : `${colors.input} ${colors.textMuted}`
                }`}
              >
                买入
              </button>
              <button
                onClick={() => setDirection('sell')}
                className={`flex-1 py-2.5 rounded-r-xl font-medium text-sm transition-all ${
                  direction === 'sell'
                    ? 'bg-[#27ae60] text-white shadow-sm'
                    : `${colors.input} ${colors.textMuted}`
                }`}
              >
                卖出
              </button>
            </div>
          </div>
        </div>

        {/* 价格输入 */}
        <div className={`px-4 py-3.5 border-b ${colors.borderLight}`}>
          <div className="flex items-center">
            <span className={`w-14 text-sm ${colors.textMuted}`}>价格</span>
            <div className="flex-1 flex items-center">
              <button 
                onClick={() => setPrice(p => String(Math.max(0, parseFloat(p || '0') - 0.01).toFixed(2)))}
                className={`w-9 h-9 rounded-lg ${colors.input} flex items-center justify-center text-lg transition active:scale-95`}
              >
                −
              </button>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="请输入价格"
                className={`flex-1 text-center py-2 bg-transparent outline-none text-base font-medium tabular-nums ${colors.text}`}
              />
              <button 
                onClick={() => setPrice(p => String((parseFloat(p || '0') + 0.01).toFixed(2)))}
                className={`w-9 h-9 rounded-lg ${colors.input} flex items-center justify-center text-lg transition active:scale-95`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 数量输入 */}
        <div className={`px-4 py-3.5 border-b ${colors.borderLight}`}>
          <div className="flex items-center">
            <span className={`w-14 text-sm ${colors.textMuted}`}>数量</span>
            <div className="flex-1 flex items-center">
              <button 
                onClick={() => setQuantity(q => String(Math.max(lotSize, parseInt(q || '0') - lotSize)))}
                className={`w-9 h-9 rounded-lg ${colors.input} flex items-center justify-center text-lg transition active:scale-95`}
              >
                −
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="请输入数量"
                className={`flex-1 text-center py-2 bg-transparent outline-none text-base font-medium tabular-nums ${colors.text}`}
              />
              <button 
                onClick={() => setQuantity(q => String(parseInt(q || '0') + lotSize))}
                className={`w-9 h-9 rounded-lg ${colors.input} flex items-center justify-center text-lg transition active:scale-95`}
              >
                +
              </button>
            </div>
          </div>
          {selectedStock && (
            <div className={`mt-1 text-xs text-right ${colors.textMuted}`}>
              每手 {lotSize} 股
            </div>
          )}
        </div>

        {/* 可买信息 */}
        <div className={`px-4 py-3 flex justify-between text-sm ${colors.textMuted}`}>
          <span>现金可买 --</span>
          <span>融资最大可买 --</span>
        </div>

        {/* 预估金额 */}
        <div className={`px-4 py-4 border-b ${colors.borderLight}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${colors.textMuted}`}>预估金额</span>
            <div className="text-right">
              <span className="text-2xl font-bold tabular-nums">{selectedStock ? currency : ''} {estimatedAmount}</span>
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${colors.textMuted}`}>预估成交后持仓成本 --</span>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            className={`flex-1 py-3.5 rounded-xl font-semibold text-white transition-all active:scale-[0.98] ${
              direction === 'buy'
                ? 'bg-[#e74c3c] shadow-[#e74c3c]/20 shadow-lg'
                : 'bg-[#27ae60] shadow-[#27ae60]/20 shadow-lg'
            } ${!canSubmit ? 'opacity-40 cursor-not-allowed shadow-none' : ''}`}
            disabled={!canSubmit}
          >
            {canSubmit 
              ? `确认${direction === 'buy' ? '买入' : '卖出'}` 
              : selectedStock 
                ? '请输入价格和数量'
                : '请先选择股票'
            }
          </button>
          <button className={`flex flex-col items-center px-2 opacity-50 hover:opacity-80 transition`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={`text-xs ${colors.textMuted}`}>预览</span>
          </button>
        </div>

        {/* 底部持仓区域 */}
        <div className={`mt-2 ${isDark ? 'bg-[#161b26]' : 'bg-[#faf9f7]'} rounded-t-3xl`}>
          {/* 持仓/当日订单 Tab */}
          <div className="px-4 pt-4 flex items-center gap-6">
            <button
              onClick={() => setActiveTab('positions')}
              className={`font-semibold text-sm pb-2 transition ${
                activeTab === 'positions' 
                  ? `${colors.text} border-b-2 ${isDark ? 'border-[#C9A55C]' : 'border-[#A8862E]'}` 
                  : colors.textMuted
              }`}
            >
              持仓
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-sm pb-2 transition ${
                activeTab === 'orders' 
                  ? `${colors.text} border-b-2 ${isDark ? 'border-[#C9A55C]' : 'border-[#A8862E]'}` 
                  : colors.textMuted
              }`}
            >
              当日订单 (0/0)
            </button>
          </div>

          {/* 表头 */}
          <div className={`grid grid-cols-4 gap-2 px-4 py-2.5 text-xs ${colors.textMuted}`}>
            <div>名称/代码</div>
            <div className="text-right">市值/数量</div>
            <div className="text-right">现价/成本</div>
            <div className="text-right">持仓盈亏</div>
          </div>

          {/* 持仓列表 */}
          <div className="pb-20">
            {MOCK_POSITIONS.map(position => (
              <button
                key={position.symbol}
                onClick={() => {
                  const stock = allStocks.find(s => s.symbol === position.symbol);
                  if (stock) {
                    handleSelectStock(stock);
                  } else {
                    setStockCode(position.symbol);
                  }
                }}
                className={`w-full grid grid-cols-4 gap-2 px-4 py-3.5 text-left transition-all ${
                  selectedStock?.symbol === position.symbol 
                    ? (isDark ? 'bg-[#1e2636]' : 'bg-[#5B8FA8]/10')
                    : ''
                } ${colors.hover} active:scale-[0.99]`}
              >
                <div>
                  <div className="font-medium text-sm">{position.name}</div>
                  <div className={`text-xs ${colors.textMuted} mt-0.5`}>
                    <span className={position.market === 'US' ? 'text-[#5B8FA8]' : 'text-[#C9A55C]'}>{position.market}</span> {position.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm tabular-nums">{position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className={`text-xs ${colors.textMuted} mt-0.5 tabular-nums`}>{position.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm tabular-nums">{position.currentPrice.toFixed(3)}</div>
                  <div className={`text-xs ${colors.textMuted} mt-0.5 tabular-nums`}>{position.costPrice.toFixed(3)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm tabular-nums ${position.profitLoss >= 0 ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                    {position.profitLoss >= 0 ? '+' : ''}{position.profitLoss.toFixed(2)}
                  </div>
                  <div className={`text-xs mt-0.5 tabular-nums ${position.profitLossPercent >= 0 ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                    {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
