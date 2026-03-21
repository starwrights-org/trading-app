'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_ORDERS, cancelOrder } from '@/lib/mockData';
import { ORDER_STATUS } from '@/lib/types';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const todayOrders = orders.filter(o => o.createdAt.startsWith('2026-03-21'));
  const historyOrders = orders.filter(o => !o.createdAt.startsWith('2026-03-21'));
  const displayOrders = activeTab === 'today' ? todayOrders : historyOrders;

  const handleCancel = async (orderId: string) => {
    if (!confirm('确认撤销此订单？')) return;
    
    const result = await cancelOrder(orderId);
    if (result.success) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      ));
      alert('✅ 撤单成功');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="mr-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">订单</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Tab 切换 */}
        <div className="flex border-b border-gray-800 px-4">
          {[
            { key: 'today', label: '今日订单' },
            { key: 'history', label: '历史订单' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 订单列表 */}
        <div className="divide-y divide-gray-800/50">
          {displayOrders.map(order => {
            const statusColors: Record<string, string> = {
              pending: 'text-yellow-500',
              partial: 'text-blue-500',
              filled: 'text-green-500',
              cancelled: 'text-gray-500',
              rejected: 'text-red-500',
            };

            return (
              <div key={order.id} className="px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {order.side === 'buy' ? '买入' : '卖出'}
                    </span>
                    <span className="font-medium">{order.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${order.market === 'HK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {order.market}
                    </span>
                  </div>
                  <span className={`text-sm ${statusColors[order.status]}`}>
                    {ORDER_STATUS[order.status]}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                  <div>
                    <div className="text-gray-500">委托价</div>
                    <div>{order.price?.toFixed(2) || '市价'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">委托量</div>
                    <div>{order.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">成交量</div>
                    <div>{order.filledQuantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">成交价</div>
                    <div>{order.filledPrice?.toFixed(2) || '-'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition"
                    >
                      撤单
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {displayOrders.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <div>暂无订单</div>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="max-w-lg mx-auto flex">
          {[
            { icon: '🏠', label: '首页', href: '/', active: false },
            { icon: '📊', label: '行情', href: '/market', active: false },
            { icon: '💹', label: '交易', href: '/trade', active: false },
            { icon: '💼', label: '持仓', href: '/positions', active: false },
            { icon: '👤', label: '我的', href: '/account', active: false },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 ${item.active ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
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
