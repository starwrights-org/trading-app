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
    const bgColor = isDark ? 'bg-[#0f1219]' : 'bg-[#faf9f7]';
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
    blue: isDark ? 'bg-[#5B8FA8]/20 text-[#5B8FA8]' : 'bg-[#5B8FA8]/10 text-[#4A7A90]',
    green: isDark ? 'bg-[#27ae60]/20 text-[#27ae60]' : 'bg-[#27ae60]/8 text-[#27ae60]',
    orange: isDark ? 'bg-[#C9A55C]/20 text-[#C9A55C]' : 'bg-[#C9A55C]/8 text-orange-600',
    gray: isDark ? 'bg-[#1e2636] text-[#edf0f5]/60' : 'bg-[#f0ede8] text-[#1a1d23]/60',
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0f1219] text-[#edf0f5]' : 'bg-[#faf9f7] text-[#1a1d23]'} pb-20`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-[#0f1219]' : 'bg-[#faf9f7]'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold tracking-tight">我的</h1>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-[#1e2636]' : 'hover:bg-[#1a1d23]/5'} transition`}
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
        <div className={`p-5 rounded-2xl mb-6 ${
          isDark ? 'bg-gradient-to-br from-[#1e2636] to-[#161b26] border border-[#2a3344]' : 'bg-white shadow-lg border border-[#e8e5df]'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#1e2636]' : 'bg-[#f0ede8]'
            }`}>
              <svg className="w-8 h-8 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">同舟证券用户</div>
              <div className={`text-sm ${isDark ? 'text-[#edf0f5]/50' : 'text-[#1a1d23]/50'}`}>ID: 30000079</div>
            </div>
            <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#2a3344]">
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className={`text-xs ${isDark ? 'text-[#edf0f5]/40' : 'text-[#1a1d23]/40'}`}>关注</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className={`text-xs ${isDark ? 'text-[#edf0f5]/40' : 'text-[#1a1d23]/40'}`}>粉丝</div>
            </div>
            <Link href="/favorites" className="text-center">
              <div className="text-xl font-semibold text-[#C9A55C]">{favCount}</div>
              <div className={`text-xs ${isDark ? 'text-[#edf0f5]/40' : 'text-[#1a1d23]/40'}`}>收藏</div>
            </Link>
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className={`text-xs ${isDark ? 'text-[#edf0f5]/40' : 'text-[#1a1d23]/40'}`}>足迹</div>
            </div>
          </div>
        </div>

        {/* 快捷功能 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {menuItems.map(item => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 ${colorMap[item.color]}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <span className={`text-xs ${isDark ? 'text-[#edf0f5]/60' : 'text-[#1a1d23]/60'}`}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 设置列表 */}
        <div className={`rounded-xl overflow-hidden ${
          isDark ? 'bg-[#1a2030]/80 border border-[#2a3344]' : 'bg-white border border-[#f0ede8] shadow-sm'
        }`}>
          {[
            { label: '账户安全', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
            { label: '消息通知', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { label: '帮助与反馈', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: '关于我们', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((item, idx) => (
            <button key={item.label} className={`w-full flex items-center justify-between p-4 ${
              idx > 0 ? `border-t ${isDark ? 'border-[#232b3b]' : 'border-[#f0ede8]'}` : ''
            } ${isDark ? 'hover:bg-[#1a2030]' : 'hover:bg-[#faf9f7]'} transition`}>
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
        <div className={`mt-6 p-4 rounded-xl ${
          isDark ? 'bg-[#1a2030]/80 border border-[#2a3344]' : 'bg-white border border-[#f0ede8] shadow-sm'
        }`}>
          <div className={`text-sm font-medium mb-3 ${isDark ? 'text-[#edf0f5]/60' : 'text-[#1a1d23]/60'}`}>外观主题</div>
          <div className="flex gap-2">
            {[
              { key: 'dark', label: '深黑' },
              { key: 'light', label: '浅白' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => {
                  localStorage.setItem('theme', t.key);
                  window.location.reload();
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
                  theme === t.key
                    ? 'bg-[#27ae60] text-white'
                    : isDark ? 'bg-[#1a2030] text-[#edf0f5]/60' : 'bg-[#f0ede8] text-[#1a1d23]/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 版本信息 */}
        <div className={`text-center py-8 ${isDark ? 'text-[#edf0f5]/30' : 'text-[#1a1d23]/40'}`}>
          <p className="text-sm">同舟证券 v1.0.0</p>
        </div>
      </div>

      <BottomNav active="account" />
    </main>
  );
}
