'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { MOCK_ORDERS, cancelOrder } from '@/lib/mockData';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'strategy'>('today');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(MOCK_ORDERS);

  // 当日订单筛选项
  const todayFilters = ['全部', '进行中', '已成交', '已撤单', '已拒绝', '已过期'];
  // 策略订单筛选项
  const strategyFilters = ['全部状态', '进行中', '暂停中', '已过期', '已撤销'];

  // 根据 Tab 过滤订单
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    
    // 按日期筛选
    if (activeTab === 'today') {
      result = result.filter(o => o.createdAt.startsWith('2026-03-21'));
    } else if (activeTab === 'history') {
      // 历史订单显示所有
    } else {
      // 策略订单（暂无数据）
      result = [];
    }

    // 按状态筛选
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

    // 搜索
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
    <main className="min-h-screen bg-white text-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/positions" className="mr-4 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-medium">订单查询</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 搜索框 */}
        <div className="px-4 py-3">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="请输入证券名称或代码的关键字"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Tab 切换：当日订单 / 历史订单 / 策略订单 */}
        <div className="flex items-center px-4 gap-6">
          <button
            onClick={() => { setActiveTab('today'); setStatusFilter('all'); }}
            className={`py-3 text-sm font-medium ${
              activeTab === 'today' ? 'text-gray-900 font-bold' : 'text-gray-400'
            }`}
          >
            当日订单 ({todayFilledCount}/{todayOrderCount})
          </button>
          <button
            onClick={() => { setActiveTab('history'); setStatusFilter('all'); }}
            className={`py-3 text-sm font-medium ${
              activeTab === 'history' ? 'text-gray-900 font-bold' : 'text-gray-400'
            }`}
          >
            历史订单
          </button>
          <button
            onClick={() => { setActiveTab('strategy'); setStatusFilter('all'); }}
            className={`py-3 text-sm font-medium ${
              activeTab === 'strategy' ? 'text-gray-900 font-bold' : 'text-gray-400'
            }`}
          >
            策略订单
          </button>
        </div>

        {/* 状态筛选 */}
        <div className="flex items-center px-4 py-2 gap-2 overflow-x-auto">
          {activeTab === 'history' ? (
            <>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-600">
                全部
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex-1" />
              <button className="text-gray-400">
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
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition ${
                  (statusFilter === 'all' && (filter === '全部' || filter === '全部状态')) || statusFilter === filter
                    ? 'border-gray-900 text-gray-900'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {filter}
              </button>
            ))
          )}
        </div>

        {/* 历史订单表头 */}
        {activeTab === 'history' && filteredOrders.length > 0 && (
          <div className="grid grid-cols-4 gap-2 px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
            <div>名称/代码</div>
            <div className="text-center">总量/委托</div>
            <div className="text-center">方向/状态</div>
            <div className="text-right">时间</div>
          </div>
        )}

        {/* 订单列表 */}
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map(order => {
              const statusText: Record<string, string> = {
                pending: '进行中',
                partial: '部分成交',
                filled: '已成交',
                cancelled: '已撤单',
                rejected: '已拒绝',
              };
              const statusColor: Record<string, string> = {
                pending: 'text-blue-500',
                partial: 'text-blue-500',
                filled: 'text-gray-500',
                cancelled: 'text-gray-400',
                rejected: 'text-red-500',
              };

              return (
                <div key={order.id} className="px-4 py-4 grid grid-cols-4 gap-2 items-start">
                  {/* 名称/代码 */}
                  <div>
                    <div className="font-medium text-gray-900">{order.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <span className={order.market === 'US' ? 'text-blue-500' : 'text-red-500'}>
                        {order.market}
                      </span>
                      <span>{order.symbol}</span>
                    </div>
                  </div>
                  
                  {/* 总量/委托 */}
                  <div className="text-center">
                    <div className="font-medium">{order.quantity}</div>
                    <div className="text-xs text-gray-400">
                      {order.orderType === 'market' ? '市价' : order.price?.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* 方向/状态 */}
                  <div className="text-center">
                    <div className={order.side === 'buy' ? 'text-orange-500 font-medium' : 'text-green-500 font-medium'}>
                      {order.side === 'buy' ? '买入' : '卖出'}
                    </div>
                    <div className={`text-xs ${statusColor[order.status]}`}>
                      {statusText[order.status]}
                    </div>
                  </div>
                  
                  {/* 时间 */}
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 美东
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* 底部提示 */}
            {activeTab === 'history' && (
              <div className="text-center py-6 text-sm text-gray-400">
                没有更多了
              </div>
            )}
          </div>
        ) : (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 mb-4">
              {/* 长桥风格的空状态图标 - 救生圈 */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <ellipse cx="50" cy="60" rx="35" ry="15" fill="#f0f0f0" />
                <ellipse cx="50" cy="50" rx="30" ry="10" fill="#e8e8e8" stroke="#d8d8d8" strokeWidth="2" />
                <ellipse cx="50" cy="50" rx="15" ry="5" fill="#f8f8f8" />
              </svg>
            </div>
            <div className="text-gray-400">暂无记录</div>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto flex">
          {[
            { icon: '📋', label: '关注', href: '/', active: false },
            { icon: '🌐', label: '市场', href: '/market', active: false },
            { icon: '📰', label: '动态', href: '/news', active: false },
            { icon: '💰', label: '资产', href: '/positions', active: false },
            { icon: '👤', label: '我的', href: '/account', active: false },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 ${
                item.active ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
