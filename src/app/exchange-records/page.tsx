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
    status: 'pending', // pending = 已提交, completed = 已兑换
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
  
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | '3months'>('all');
  const [showTimeFilter, setShowTimeFilter] = useState(false);

  // 按月份分组
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
      <div className={`${colors.bg} sticky top-0 z-10 border-b ${colors.border}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/currency-exchange" className={`mr-4 ${colors.textSecondary} hover:${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-medium">兑换记录</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 账户选择 */}
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">💰</span>
          <span className={colors.text}>证券账户 (LBPT10078568)</span>
        </div>

        {/* 时间筛选 */}
        <div className="px-4 py-2 flex items-center justify-between">
          <button 
            onClick={() => setShowTimeFilter(true)}
            className={`flex items-center gap-1 px-3 py-1.5 border ${colors.border} rounded-full text-sm`}
          >
            {getTimeFilterLabel()}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className={colors.textSecondary}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* 兑换记录列表 - 按月份分组 */}
        {Object.keys(groupedRecords).length > 0 ? (
          <div>
            {Object.entries(groupedRecords).map(([monthKey, records]) => (
              <div key={monthKey}>
                {/* 月份标题 */}
                <div className={`px-4 py-3 text-lg font-bold ${colors.text}`}>
                  {getMonthLabel(monthKey)}
                </div>
                
                {/* 该月记录 */}
                <div className={`divide-y ${colors.borderLight}`}>
                  {records.map(record => (
                    <div key={record.id} className="px-4 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`font-medium ${colors.text}`}>
                            {record.fromCurrency === 'HKD' ? '港元' : record.fromCurrency === 'USD' ? '美元' : '人民币'} → {record.toCurrency === 'USD' ? '美元' : record.toCurrency === 'HKD' ? '港元' : '人民币'}
                          </div>
                          <div className={`text-sm ${colors.textMuted} mt-1`}>
                            {record.date} | {record.status === 'pending' ? '已提交' : '已兑换'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${colors.text} flex items-center justify-end gap-1`}>
                            {record.isEstimate && (
                              <span className={`text-xs px-1.5 py-0.5 border ${colors.border} rounded`}>预估</span>
                            )}
                            <span>+{record.toAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {record.toCurrency}</span>
                          </div>
                          <div className={`text-sm ${colors.textMuted} mt-1`}>
                            -{record.fromAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {record.fromCurrency}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* 底部提示 */}
            <div className={`text-center py-6 text-sm text-blue-500`}>
              没有更多了
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <ellipse cx="50" cy="60" rx="35" ry="15" fill={theme === 'dark' ? '#2d3748' : '#f0f0f0'} />
                <ellipse cx="50" cy="50" rx="30" ry="10" fill={theme === 'dark' ? '#1a202c' : '#e8e8e8'} stroke={theme === 'dark' ? '#4a5568' : '#d8d8d8'} strokeWidth="2" />
                <ellipse cx="50" cy="50" rx="15" ry="5" fill={theme === 'dark' ? '#2d3748' : '#f8f8f8'} />
              </svg>
            </div>
            <div className={colors.textMuted}>暂无记录</div>
          </div>
        )}
      </div>

      {/* 时间筛选弹窗 */}
      {showTimeFilter && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className={`w-full ${colors.bg} rounded-t-3xl`}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <span className={`text-lg font-medium ${colors.text}`}>选择时间</span>
              <button onClick={() => setShowTimeFilter(false)} className={colors.textMuted}>
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
                    className={`px-6 py-2 rounded-full border transition ${
                      timeFilter === option.key
                        ? 'border-blue-500 bg-blue-500 text-white'
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
                className="w-full py-3 bg-blue-500 text-white rounded-full font-medium"
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
