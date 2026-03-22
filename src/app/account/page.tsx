'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

const FAVORITES_KEY = 'trading_app_favorites';

function getFavoritesCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data).length : 0;
  } catch {
    return 0;
  }
}

export default function AccountPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavoritesCount());
  }, []);

  const menuItems = [
    { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: '自选', href: '/', color: 'blue' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: '换汇', href: '/currency-exchange', color: 'green' },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: '订单', href: '/orders', color: 'orange' },
    { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: '设置', href: '/settings', color: 'gray' },
  ];

  const colorMap: { [key: string]: string } = {
    blue: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
    green: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600',
    orange: isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600',
    gray: isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600',
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-black'} pb-20`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">我的</h1>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition`}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5">
        {/* 用户卡片 */}
        <div className={`p-5 rounded-3xl mb-6 ${
          isDark ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.03]' : 'bg-white shadow-lg'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-white/10' : 'bg-gray-100'
            }`}>
              <svg className="w-8 h-8 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">同舟证券用户</div>
              <div className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>ID: 30000079</div>
            </div>
            <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10">
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>关注</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>粉丝</div>
            </div>
            <Link href="/favorites" className="text-center">
              <div className="text-xl font-semibold text-rose-500">{favCount}</div>
              <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>收藏</div>
            </Link>
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>足迹</div>
            </div>
          </div>
        </div>

        {/* 快捷功能 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {menuItems.map(item => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${colorMap[item.color]}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <span className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 设置列表 */}
        <div className={`rounded-2xl overflow-hidden ${
          isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'
        }`}>
          {[
            { label: '账户安全', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
            { label: '消息通知', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { label: '帮助与反馈', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: '关于我们', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((item, idx) => (
            <button key={item.label} className={`w-full flex items-center justify-between p-4 ${
              idx > 0 ? `border-t ${isDark ? 'border-white/5' : 'border-gray-100'}` : ''
            } ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition`}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </div>
              <svg className="w-5 h-5 opacity-30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* 主题切换 */}
        <div className={`mt-6 p-4 rounded-2xl flex items-center justify-between ${
          isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-gray-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>深色模式</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`relative w-12 h-7 rounded-full transition-colors ${isDark ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* 版本信息 */}
        <div className={`text-center py-8 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
          <p className="text-sm">同舟证券 v1.0.0</p>
        </div>
      </div>

      <BottomNav active="account" />
    </main>
  );
}
