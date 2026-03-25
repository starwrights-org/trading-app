'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// Mock 兑换记录数据
const MOCK_EXCHANGE_RECORDS = [
  { 
    id: '1', 
    fromCurrency: 'HKD', 
    toCurrency: 'USD', 
    fromAmount: 600.00, 
    toAmount: 76.98, 
    status: 'pending',
    date: '2026.03.21 18:44:38',
    month: '2026-03',
    isEstimate: true,
  },
  { 
    id: '2', 
    fromCurrency: 'HKD', 
    toCurrency: 'USD', 
    fromAmount: 779423.23, 
    toAmount: 100000.00, 
    status: 'completed',
    date: '2026.03.08 22:04:58',
    month: '2026-03',
    isEstimate: false,
  },
];

export default function ExchangeRecordsPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | '3months'>('all');
  const [showTimeFilter, setShowTimeFilter] = useState(false);

  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof MOCK_EXCHANGE_RECORDS> = {};
    
    MOCK_EXCHANGE_RECORDS.forEach(record => {
      const monthKey = record.month;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(record);
    });
    
    return groups;
  }, []);

  const getMonthLabel = (monthKey: string) => {
    const now = new Date('2026-03-21');
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthKey === currentMonth) return '本月';
    return monthKey.replace('-', '年') + '月';
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'all': return '全部时间';
      case 'week': return '近1周';
      case 'month': return '近1月';
      case '3months': return '近3月';
      default: return '全部时间';
    }
  };

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10 border-b ${colors.borderLight}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/currency-exchange" className={`p-1 mr-3 rounded-lg ${colors.hover} transition`}>
            <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold">兑换记录</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-lg mx-auto animate-page-enter">
        {/* 账户选择 */}
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-[#C9A55C] rounded-lg flex items-center justify-center text-white text-xs">💰</span>
          <span className={`text-sm ${colors.text}`}>证券账户 (LBPT10078568)</span>
        </div>

        {/* 时间筛选 */}
        <div className="px-4 py-2 flex items-center justify-between">
          <button 
            onClick={() => setShowTimeFilter(true)}
            className={`flex items-center gap-1 px-3 py-1.5 border ${colors.border} rounded-xl text-sm transition ${colors.hover}`}
          >
            {getTimeFilterLabel()}
            <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className={`p-1.5 rounded-lg ${colors.hover} transition opacity-60`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* 兑换记录列表 */}
        {Object.keys(groupedRecords).length > 0 ? (
          <div>
            {Object.entries(groupedRecords).map(([monthKey, records]) => (
              <div key={monthKey}>
                <div className={`px-4 py-2 text-base font-bold ${colors.text}`}>
                  {getMonthLabel(monthKey)}
                </div>
                
                <div className="px-4 space-y-3 mb-4">
                  {records.map(record => (
                    <div 
                      key={record.id} 
                      className={`p-4 rounded-xl card-hover ${isDark ? 'bg-[#1a2030]/80 border border-[#2a3344]' : 'bg-white border border-[#f0ede8] shadow-sm'}`}
                    >
                      {/* 顶行：方向 + 状态 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${colors.text}`}>
                          {record.fromCurrency === 'HKD' ? '港元' : record.fromCurrency === 'USD' ? '美元' : '人民币'} → {record.toCurrency === 'USD' ? '美元' : record.toCurrency === 'HKD' ? '港元' : '人民币'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-lg ${
                          record.status === 'pending' 
                            ? 'bg-[#5B8FA8]/12 text-[#5B8FA8]' 
                            : isDark ? 'bg-[#1a2030] text-[#edf0f5]/50' : 'bg-[#f0ede8] text-[#1a1d23]/50'
                        }`}>
                          {record.status === 'pending' ? '已提交' : '已兑换'}
                        </span>
                      </div>
                      
                      {/* 金额 */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${colors.textMuted}`}>兑入</span>
                        <div className="flex items-center gap-1.5">
                          {record.isEstimate && (
                            <span className={`text-xs px-1.5 py-0.5 border ${colors.border} rounded-md ${colors.textMuted}`}>预估</span>
                          )}
                          <span className={`font-medium text-sm tabular-nums text-[#e74c3c]`}>
                            +{record.toAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {record.toCurrency}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${colors.textMuted}`}>{record.date}</span>
                        <span className={`text-xs tabular-nums ${colors.textMuted}`}>
                          -{record.fromAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {record.fromCurrency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className={`text-center py-6 text-sm ${colors.textMuted}`}>
              没有更多了
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-[#1a2030]' : 'bg-[#f0ede8]'} flex items-center justify-center`}>
              <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={colors.textMuted}>暂无记录</div>
          </div>
        )}
      </div>

      {/* 时间筛选弹窗 */}
      {showTimeFilter && (
        <div className="fixed inset-0 bg-[#1a1d23]/50 z-50 flex items-end animate-backdrop">
          <div className={`w-full ${colors.bg} rounded-t-3xl animate-sheet`}>
            <div className={`flex items-center justify-between px-4 py-4 border-b ${colors.borderLight}`}>
              <span className={`text-lg font-semibold ${colors.text}`}>选择时间</span>
              <button onClick={() => setShowTimeFilter(false)} className={`p-1 rounded-lg ${colors.hover} transition opacity-60`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'week', label: '近1周' },
                  { key: 'month', label: '近1月' },
                  { key: '3months', label: '近3月' },
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setTimeFilter(option.key as typeof timeFilter);
                      setShowTimeFilter(false);
                    }}
                    className={`px-5 py-2 rounded-xl border transition ${
                      timeFilter === option.key
                        ? 'border-[#5B8FA8] bg-[#5B8FA8] text-white'
                        : `${colors.border} ${colors.textSecondary}`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-4 pb-8">
              <button 
                onClick={() => setShowTimeFilter(false)}
                className="w-full py-3 bg-[#5B8FA8] text-white rounded-xl font-medium transition active:scale-[0.98]"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="positions" />
    </main>
  );
}
