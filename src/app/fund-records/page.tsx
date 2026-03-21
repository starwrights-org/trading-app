'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// Mock 资金记录数据
const MOCK_FUND_RECORDS = [
  { id: '1', type: '股票买入成交', date: '2026/03/21 02:51:29', amount: -4630.78, currency: 'USD', detail: 'MU.US | 11 股', month: '2026-03' },
  { id: '2', type: '股票买入成交', date: '2026/03/19 21:31:23', amount: -4691.45, currency: 'USD', detail: 'MU.US | 11 股', month: '2026-03' },
  { id: '3', type: '货币兑换入账', date: '2026/03/09 09:00:21', amount: 100000.00, currency: 'USD', detail: 'HKD 换汇至 USD @ 0.1283', month: '2026-03' },
  { id: '4', type: '货币兑换出账', date: '2026/03/09 09:00:21', amount: -779423.23, currency: 'HKD', detail: 'HKD 换汇至 USD @ 0.1283', month: '2026-03' },
  { id: '5', type: '活动礼包', date: '2026/03/08 21:44:27', amount: 800000.00, currency: 'HKD', detail: 'demo account deposit', month: '2026-03' },
  { id: '6', type: '股票卖出成交', date: '2026/02/28 15:30:00', amount: 12500.00, currency: 'HKD', detail: '00700.HK | 100 股', month: '2026-02' },
  { id: '7', type: '股息入账', date: '2026/02/15 09:00:00', amount: 350.00, currency: 'HKD', detail: '00700.HK 派息', month: '2026-02' },
  { id: '8', type: '股票买入成交', date: '2026/01/20 10:15:00', amount: -25000.00, currency: 'HKD', detail: '09988.HK | 200 股', month: '2026-01' },
];

export default function FundRecordsPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | '3months' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('2000.01.01');
  const [customEndDate, setCustomEndDate] = useState('2026.03.21');

  // 按时间筛选记录
  const filteredRecords = useMemo(() => {
    let records = [...MOCK_FUND_RECORDS];
    
    const now = new Date('2026-03-21');
    
    if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      records = records.filter(r => new Date(r.date.replace(/\//g, '-')) >= weekAgo);
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      records = records.filter(r => new Date(r.date.replace(/\//g, '-')) >= monthAgo);
    } else if (timeFilter === '3months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      records = records.filter(r => new Date(r.date.replace(/\//g, '-')) >= threeMonthsAgo);
    }
    
    return records;
  }, [timeFilter]);

  // 按月份分组
  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof MOCK_FUND_RECORDS> = {};
    
    filteredRecords.forEach(record => {
      const monthKey = record.month;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(record);
    });
    
    return groups;
  }, [filteredRecords]);

  const getMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const now = new Date('2026-03-21');
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthKey === currentMonth) return '本月';
    if (monthKey === '2026-02') return '2月';
    if (monthKey === '2026-01') return '1月';
    return `${year}年${parseInt(month)}月`;
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'all': return '全部时间';
      case 'week': return '近1周';
      case 'month': return '近1月';
      case '3months': return '近3月';
      case 'custom': return '自定义';
      default: return '全部时间';
    }
  };

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10 border-b ${colors.border}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/positions" className={`mr-4 ${colors.textSecondary} hover:${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-medium">资金记录</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 账户选择 */}
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">💰</span>
          <span className={colors.text}>模拟炒股 (LBPT10078568)</span>
        </div>

        {/* 时间筛选 + 筛选图标 */}
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

        {/* 资金记录列表 - 按月份分组 */}
        {Object.keys(groupedRecords).length > 0 ? (
          <div>
            {Object.entries(groupedRecords).map(([monthKey, records]) => (
              <div key={monthKey}>
                {/* 月份标题 */}
                <div className={`px-4 py-2 text-lg font-bold ${colors.text}`}>
                  {getMonthLabel(monthKey)}
                </div>
                
                {/* 该月记录 */}
                <div className={`divide-y ${colors.borderLight}`}>
                  {records.map(record => (
                    <div key={record.id} className="px-4 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`font-medium ${colors.text}`}>{record.type}</div>
                          <div className={`text-sm ${colors.textMuted} mt-1`}>{record.date}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${record.amount >= 0 ? colors.text : colors.text}`}>
                            {record.amount >= 0 ? '' : '-'}{record.currency} {Math.abs(record.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-sm ${colors.textMuted} mt-1`}>{record.detail}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* 底部提示 */}
            <div className={`text-center py-6 text-sm ${colors.textMuted}`}>
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
            {/* 弹窗标题 */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <span className="text-lg font-medium">自定义时间</span>
              <button onClick={() => setShowTimeFilter(false)} className={colors.textMuted}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 快捷选项 */}
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
                    onClick={() => setTimeFilter(option.key as typeof timeFilter)}
                    className={`px-6 py-2 rounded-full border transition ${
                      timeFilter === option.key
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : `${colors.border} ${colors.textSecondary}`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义日期范围 */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-4">
                <button className={`flex-1 py-3 px-4 border ${colors.border} rounded-full text-center ${colors.textSecondary}`}>
                  {customStartDate}
                </button>
                <span className={colors.textMuted}>—</span>
                <button className={`flex-1 py-3 px-4 border ${colors.border} rounded-full text-center ${colors.textSecondary}`}>
                  {customEndDate}
                </button>
              </div>
            </div>

            {/* 日期选择器（简化版） */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="font-bold text-lg">2000 年</div>
                  <div className={`${colors.textMuted} text-sm`}>2001 年</div>
                  <div className={`${colors.textMuted} text-sm`}>2002 年</div>
                </div>
                <div>
                  <div className="font-bold text-lg">1 月</div>
                  <div className={`${colors.textMuted} text-sm`}>2 月</div>
                  <div className={`${colors.textMuted} text-sm`}>3 月</div>
                </div>
                <div>
                  <div className="font-bold text-lg">1 日</div>
                  <div className={`${colors.textMuted} text-sm`}>2 日</div>
                  <div className={`${colors.textMuted} text-sm`}>3 日</div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex gap-4 px-4 py-4 pb-8">
              <button 
                onClick={() => {
                  setTimeFilter('all');
                }}
                className={`flex-1 py-3 border ${colors.border} rounded-full ${colors.text}`}
              >
                重置
              </button>
              <button 
                onClick={() => setShowTimeFilter(false)}
                className="flex-1 py-3 bg-gray-900 text-white rounded-full"
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
