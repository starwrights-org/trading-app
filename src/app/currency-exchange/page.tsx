'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme, themeColors } from '@/lib/theme';

// 货币配置
const CURRENCIES = {
  HKD: { name: '港元', flag: '🇭🇰', balance: 20576.77 },
  USD: { name: '美元', flag: '🇺🇸', balance: 90673.71 },
  CNH: { name: '离岸人民币', flag: '🇨🇳', balance: 0 },
};

// 汇率
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  HKD: { USD: 0.1283, CNH: 0.9234 },
  USD: { HKD: 7.7942, CNH: 7.1965 },
  CNH: { HKD: 1.0829, USD: 0.1390 },
};

export default function CurrencyExchangePage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [fromCurrency, setFromCurrency] = useState<'HKD' | 'USD' | 'CNH'>('HKD');
  const [toCurrency, setToCurrency] = useState<'HKD' | 'USD' | 'CNH'>('USD');
  const [fromAmount, setFromAmount] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showBalanceDetail, setShowBalanceDetail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [submitTime, setSubmitTime] = useState('');

  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency] || 1;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(2) : '';
  
  const fromBalance = CURRENCIES[fromCurrency].balance;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount('');
  };

  const handleAll = () => {
    setFromAmount(fromBalance.toFixed(2));
  };

  const handleApply = () => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(/\//g, '.');
    setSubmitTime(timeStr);
    setShowConfirmModal(false);
    setShowSuccessPage(true);
  };

  const getEstimateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 2);
    now.setHours(9, 5, 0);
    return now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '.');
  };

  // 成功页面
  if (showSuccessPage) {
    return (
      <main className={`min-h-screen ${colors.bg} ${colors.text}`}>
        <div className="max-w-lg mx-auto flex flex-col min-h-screen">
          {/* 成功图标和标题 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className={`text-xl font-bold ${colors.text} mb-2`}>兑换申请已提交</h1>
            <p className={`text-sm ${colors.textMuted}`}>您的兑换申请正在加速处理中，请耐心等待</p>
          </div>

          {/* 时间线 */}
          <div className={`px-6 py-8 border-t ${colors.border}`}>
            <div className="flex">
              {/* 时间线左侧 */}
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 bg-gray-900 rounded-full" />
                <div className={`w-0.5 h-12 ${colors.border} bg-current`} />
                <div className={`w-3 h-3 border-2 ${colors.border} rounded-full`} />
              </div>
              
              {/* 时间线内容 */}
              <div className="flex-1">
                <div className="mb-8">
                  <div className={`font-medium ${colors.text}`}>兑换申请已提交</div>
                  <div className={`text-sm ${colors.textMuted}`}>{submitTime}</div>
                </div>
                <div>
                  <div className={`font-medium ${colors.text}`}>预计到帐时间</div>
                  <div className={`text-sm ${colors.textMuted}`}>预计 {getEstimateTime()} 前完成</div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-4 pb-8">
            <Link 
              href="/positions"
              className="block w-full py-4 bg-blue-500 text-white text-center rounded-full font-medium"
            >
              完成
            </Link>
            <div className={`text-center mt-4 text-sm ${colors.textMuted}`}>
              如有疑问，可联系<span className="text-blue-500">在线客服</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/positions" className={`mr-4 ${colors.textSecondary} hover:${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <div className="text-lg font-medium">货币兑换</div>
            <div className={`text-xs ${colors.textMuted}`}>模拟炒股 (LBPT10078568)</div>
          </div>
          <Link href="/exchange-records" className={colors.textSecondary}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 进行中的兑换提示 */}
        <Link 
          href="/exchange-records"
          className={`mx-4 mt-3 flex items-center justify-between px-4 py-3 ${colors.bgCard} rounded-xl`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className={colors.text}>您有 1 笔进行中的货币兑换</span>
          </div>
          <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* 参考汇率 */}
        <div className={`px-4 py-3 ${colors.textSecondary} text-sm`}>
          参考汇率：1 {CURRENCIES[fromCurrency].name} = {rate.toFixed(4)} {CURRENCIES[toCurrency].name}
        </div>

        {/* 兑换卡片 */}
        <div className={`mx-4 ${colors.bgCard} rounded-2xl p-4`}>
          {/* 货币选择行 */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setShowFromPicker(true)}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">{CURRENCIES[fromCurrency].flag}</span>
              <span className="font-medium">{CURRENCIES[fromCurrency].name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button onClick={handleSwap} className={`p-2 ${colors.textSecondary}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <button 
              onClick={() => setShowToPicker(true)}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">{CURRENCIES[toCurrency].flag}</span>
              <span className="font-medium">{CURRENCIES[toCurrency].name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* 兑出金额 */}
          <div className="mb-4">
            <div className={`text-sm ${colors.textMuted} mb-2`}>兑出</div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{fromCurrency}</span>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="输入兑出金额"
                  className={`text-2xl font-bold bg-transparent outline-none w-32 ${colors.text}`}
                />
              </div>
              <button onClick={handleAll} className="text-blue-500 text-sm">
                全部
              </button>
            </div>
          </div>

          {/* 可兑预估 */}
          <div className="mb-4">
            <button 
              onClick={() => setShowBalanceDetail(!showBalanceDetail)}
              className="flex items-center gap-2"
            >
              <span className={colors.textMuted}>可兑预估</span>
              <span className="text-orange-500 font-medium">
                {fromBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {fromCurrency}
              </span>
              <svg className={`w-4 h-4 ${colors.textMuted} transition ${showBalanceDetail ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showBalanceDetail && (
              <div className={`mt-2 text-sm ${colors.textSecondary}`}>
                <div>美元可兑：{CURRENCIES.USD.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</div>
                <div>港元可兑：{CURRENCIES.HKD.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} HKD</div>
              </div>
            )}
          </div>

          {/* 分隔线 */}
          <div className={`border-t ${colors.borderLight} my-4`} />

          {/* 兑入金额 */}
          <div>
            <div className={`text-sm ${colors.textMuted} mb-2`}>兑入</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{toCurrency}</span>
              <span className={`text-2xl font-bold ${toAmount ? colors.text : colors.textMuted}`}>
                {toAmount || '0.00'}
              </span>
              {toAmount && <span className={`text-sm ${colors.textMuted}`}>预估</span>}
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className={`mx-4 mt-6 p-4 ${colors.bgSecondary} rounded-xl`}>
          <div className={`font-medium ${colors.text} mb-2`}>温馨提示</div>
          <div className={`text-sm ${colors.textMuted} space-y-1`}>
            <p>1. 页面中展示的汇率仅供参考，请以实际兑换后的金额为准。</p>
            <p>2. 预计完成时间仅供参考，请以实际完成时间为准。</p>
            <p>3. 功能仅用于交易结算，请不要使用它进行货币投机，与交易无关的请求都将被拒绝，请谨慎操作。</p>
          </div>
        </div>

        {/* 汇率服务提供商 */}
        <div className={`text-center py-6 text-sm ${colors.textMuted}`}>
          汇率及换汇服务由银行提供
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={`fixed bottom-0 left-0 right-0 ${colors.bg} p-4 pb-6`}>
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleApply}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            className={`w-full py-4 rounded-full font-medium transition ${
              fromAmount && parseFloat(fromAmount) > 0
                ? 'bg-blue-500 text-white'
                : `${colors.bgSecondary} ${colors.textMuted}`
            }`}
          >
            申请兑换
          </button>
        </div>
      </div>

      {/* 确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className={`w-full ${colors.bg} rounded-t-3xl`}>
            {/* 标题栏 */}
            <div className={`flex items-center justify-between px-4 py-4`}>
              <span className={`text-lg font-medium ${colors.text}`}>货币兑换确认</span>
              <button onClick={() => setShowConfirmModal(false)} className={colors.textMuted}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 兑换信息 */}
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className={colors.textMuted}>兑出</span>
                <span className={`font-medium ${colors.text}`}>
                  {parseFloat(fromAmount).toFixed(2)} {CURRENCIES[fromCurrency].name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={colors.textMuted}>兑入</span>
                <div className="text-right">
                  <span className={`text-sm ${colors.textMuted}`}>预估 </span>
                  <span className={`font-medium ${colors.text}`}>
                    {toAmount} {CURRENCIES[toCurrency].name}
                  </span>
                </div>
              </div>
            </div>

            {/* 确定按钮 */}
            <div className="px-4 py-4 pb-8">
              <button 
                onClick={handleConfirm}
                className="w-full py-4 bg-blue-500 text-white rounded-full font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 货币选择弹窗 - 兑出 */}
      {showFromPicker && (
        <CurrencyPicker
          title="兑出货币"
          selected={fromCurrency}
          onSelect={(currency) => {
            setFromCurrency(currency);
            if (currency === toCurrency) {
              setToCurrency(fromCurrency);
            }
            setShowFromPicker(false);
          }}
          onClose={() => setShowFromPicker(false)}
          colors={colors}
        />
      )}

      {/* 货币选择弹窗 - 兑入 */}
      {showToPicker && (
        <CurrencyPicker
          title="兑入货币"
          selected={toCurrency}
          onSelect={(currency) => {
            setToCurrency(currency);
            if (currency === fromCurrency) {
              setFromCurrency(toCurrency);
            }
            setShowToPicker(false);
          }}
          onClose={() => setShowToPicker(false)}
          colors={colors}
        />
      )}
    </main>
  );
}

// 货币选择器组件
function CurrencyPicker({ 
  title, 
  selected, 
  onSelect, 
  onClose,
  colors 
}: { 
  title: string;
  selected: string;
  onSelect: (currency: 'HKD' | 'USD' | 'CNH') => void;
  onClose: () => void;
  colors: typeof themeColors.dark;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className={`w-full ${colors.bg} rounded-t-3xl`}>
        {/* 标题栏 */}
        <div className={`flex items-center justify-between px-4 py-4 border-b ${colors.border}`}>
          <button onClick={onClose} className={colors.textSecondary}>取消</button>
          <span className={`font-medium ${colors.text}`}>{title}</span>
          <button onClick={onClose} className="text-blue-500">确定</button>
        </div>

        {/* 货币列表 */}
        <div className="py-4">
          {(['HKD', 'USD', 'CNH'] as const).map(currency => (
            <button
              key={currency}
              onClick={() => onSelect(currency)}
              className={`w-full px-4 py-4 flex items-center justify-between ${colors.hover}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CURRENCIES[currency].flag}</span>
                <div>
                  <div className={`font-medium ${colors.text}`}>{CURRENCIES[currency].name}</div>
                  <div className={`text-sm ${colors.textMuted}`}>{currency}</div>
                </div>
              </div>
              {selected === currency && (
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
