'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { MOCK_ORDERS, cancelOrder } from '@/lib/mockData';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

export default function OrdersPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'strategy'>('today');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const todayFilters = ['全部', '进行中', '已成交', '已撤单', '已拒绝', '已过期'];
  const strategyFilters = ['全部状态', '进行中', '暂停中', '已过期', '已撤销'];

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    
    if (activeTab === 'today') {
      result = result.filter(o => o.createdAt.startsWith('2026-03-21'));
    } else if (activeTab === 'strategy') {
      result = [];
    }

    if (statusFilter !== 'all' && statusFilter !== '全部' && statusFilter !== '全部状态') {
      const statusMap: Record<string, string> = {
        '进行中': 'pending',
        '已成交': 'filled',
        '已撤单': 'cancelled',
        '已拒绝': 'rejected',
        '已过期': 'expired',
        '暂停中': 'paused',
        '已撤销': 'cancelled',
      };
      result = result.filter(o => o.status === statusMap[statusFilter]);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.name.toLowerCase().includes(query) || 
        o.symbol.toLowerCase().includes(query)
      );
    }

    return result;
  }, [orders, activeTab, statusFilter, searchQuery]);

  const todayOrderCount = orders.filter(o => o.createdAt.startsWith('2026-03-21')).length;
  const todayFilledCount = orders.filter(o => o.createdAt.startsWith('2026-03-21') && o.status === 'filled').length;

  const handleCancel = async (orderId: string) => {
    if (!confirm('确认撤销此订单？')) return;
    
    const result = await cancelOrder(orderId);
    if (result.success) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      ));
    }
  };

  const currentFilters = activeTab === 'strategy' ? strategyFilters : todayFilters;

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10 border-b ${colors.borderLight}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/positions" className={`p-1 mr-3 rounded-lg ${colors.hover} transition`}>
            <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold">订单查询</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-lg mx-auto animate-page-enter">
        {/* 搜索框 */}
        <div className="px-4 py-3">
          <div className={`flex items-center ${colors.input} rounded-xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#5B8FA8]/20`}>
            <svg className={`w-4 h-4 opacity-40 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="请输入证券名称或代码"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent text-sm outline-none ${colors.text}`}
            />
          </div>
        </div>

        {/* Tab 切换 */}
        <div className={`flex items-center px-4 gap-1 border-b ${colors.borderLight}`}>
          {[
            { key: 'today', label: `当日订单 (${todayFilledCount}/${todayOrderCount})` },
            { key: 'history', label: '历史订单' },
            { key: 'strategy', label: '策略订单' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key as typeof activeTab); setStatusFilter('all'); }}
              className={`py-3 px-3 text-sm font-medium transition border-b-2 ${
                activeTab === tab.key 
                  ? `${colors.text} ${isDark ? 'border-[#C9A55C]' : 'border-[#A8862E]'}` 
                  : `${colors.textMuted} border-transparent`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 状态筛选 */}
        <div className="flex items-center px-4 py-2.5 gap-2 overflow-x-auto no-scrollbar">
          {activeTab === 'history' ? (
            <>
              <button className={`flex items-center gap-1 px-3 py-1.5 border ${colors.border} rounded-xl text-sm ${colors.textSecondary}`}>
                全部
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex-1" />
              <button className={`p-1.5 rounded-lg ${colors.hover} transition opacity-60`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </>
          ) : (
            currentFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter === '全部' || filter === '全部状态' ? 'all' : filter)}
                className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap border transition ${
                  (statusFilter === 'all' && (filter === '全部' || filter === '全部状态')) || statusFilter === filter
                    ? isDark ? 'border-[#3a4455] bg-[#1e2636] text-white' : 'border-gray-900 bg-gray-900 text-white'
                    : `${colors.border} ${colors.textMuted}`
                }`}
              >
                {filter}
              </button>
            ))
          )}
        </div>

        {/* 订单列表 - 卡片式布局（移动端友好） */}
        {filteredOrders.length > 0 ? (
          <div className={`divide-y ${colors.borderLight}`}>
            {filteredOrders.map((order, idx) => {
              const statusText: Record<string, string> = {
                pending: '进行中',
                partial: '部分成交',
                filled: '已成交',
                cancelled: '已撤单',
                rejected: '已拒绝',
              };
              const statusColor: Record<string, string> = {
                pending: 'text-[#5B8FA8]',
                partial: 'text-[#5B8FA8]',
                filled: colors.textMuted,
                cancelled: colors.textMuted,
                rejected: 'text-[#e74c3c]',
              };

              return (
                <div 
                  key={order.id} 
                  className={`px-4 py-4 ${colors.hover} transition`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* 顶部：名称 + 状态 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${colors.text}`}>{order.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                        order.market === 'US' ? 'bg-[#5B8FA8]/12 text-[#5B8FA8]' : 'bg-[#C9A55C]/12 text-[#C9A55C]'
                      }`}>
                        {order.market}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${order.side === 'buy' ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                        {order.side === 'buy' ? '买入' : '卖出'}
                      </span>
                      <span className={`text-xs ${statusColor[order.status]}`}>
                        {statusText[order.status]}
                      </span>
                    </div>
                  </div>
                  
                  {/* 底部：详情 */}
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${colors.textMuted} flex items-center gap-3`}>
                      <span>{order.symbol}</span>
                      <span>×{order.quantity}</span>
                      <span>{order.orderType === 'market' ? '市价' : `$${order.price?.toFixed(2)}`}</span>
                    </div>
                    <div className={`text-xs ${colors.textMuted}`}>
                      {new Date(order.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {activeTab === 'history' && (
              <div className={`text-center py-6 text-sm ${colors.textMuted}`}>
                没有更多了
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-[#1a2030]' : 'bg-[#f0ede8]'} flex items-center justify-center`}>
              <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className={colors.textMuted}>暂无记录</div>
          </div>
        )}
      </div>

      <BottomNav active="positions" />
    </main>
  );
}
