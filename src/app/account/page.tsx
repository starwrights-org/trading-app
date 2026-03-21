'use client';

import Link from 'next/link';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

export default function AccountPage() {
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-end gap-4">
          <button className={colors.textSecondary}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className={colors.textSecondary}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className={colors.textSecondary}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* 用户信息 */}
        <div className="flex items-center gap-4 py-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg">同舟证券用户</div>
            <div className={`text-sm ${colors.textMuted}`}>登录ID: 30000079</div>
          </div>
          <Link href="#" className={`text-sm ${colors.textMuted} flex items-center`}>
            主页
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 统计数据 */}
        <div className="flex justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center flex-1">
            <div className="text-xl font-bold">0</div>
            <div className={`text-sm ${colors.textMuted}`}>关注</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-bold">0</div>
            <div className={`text-sm ${colors.textMuted}`}>关注者</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-bold">1</div>
            <div className={`text-sm ${colors.textMuted}`}>我的收藏</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-bold">0</div>
            <div className={`text-sm ${colors.textMuted}`}>浏览记录</div>
          </div>
        </div>

        {/* 功能入口 - 第一排 */}
        <div className="flex justify-between py-6">
          <Link href="/market" className="text-center flex-1">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-sm">我的行情</div>
          </Link>
          <Link href="#" className="text-center flex-1">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="text-sm">我的卡券</div>
          </Link>
          <Link href="#" className="text-center flex-1">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-sm">我的费率</div>
          </Link>
        </div>

        {/* 功能入口 - 第二排 */}
        <div className={`flex ${colors.bgCard} rounded-xl mb-4`}>
          <Link href="#" className="flex-1 text-center py-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-orange-500">🎯</span>
              <span className="font-medium">任务中心</span>
            </div>
            <div className={`text-xs ${colors.textMuted} mt-1`}>做任务赚币</div>
          </Link>
          <div className={`w-px ${colors.border}`}></div>
          <Link href="#" className="flex-1 text-center py-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-orange-500">🎁</span>
              <span className="font-medium">兑换商城</span>
            </div>
            <div className={`text-xs ${colors.textMuted} mt-1`}>免费兑股票</div>
          </Link>
        </div>

        {/* 列表菜单 */}
        <div className={`${colors.bgCard} rounded-xl divide-y ${colors.border}`}>
          <Link href="#" className={`flex items-center justify-between px-4 py-4 ${colors.hover}`}>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>帮助与客服</span>
            </div>
            <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button onClick={toggleTheme} className={`flex items-center justify-between px-4 py-4 ${colors.hover} w-full`}>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>设置</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${colors.textMuted}`}>{theme === 'dark' ? '深色' : '浅色'}模式</span>
              <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <BottomNav active="account" />
    </main>
  );
}
