'use client';

import Link from 'next/link';
import { useTheme, themeColors } from '@/lib/theme';
import { MOCK_ACCOUNT } from '@/lib/mockData';
import BottomNav from '@/components/BottomNav';

export default function AccountPage() {
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">我的账户</h1>
          <button onClick={toggleTheme} className={`${colors.textSecondary} hover:${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 用户信息 */}
        <div className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <div className="font-bold text-lg">演示账户</div>
            <div className={`text-sm ${colors.textMuted}`}>ID: DEMO123456</div>
          </div>
        </div>

        {/* 资产概览 */}
        <div className={`m-4 bg-gradient-to-r ${colors.cardGradient} rounded-xl p-4`}>
          <div className={`text-sm ${colors.textSecondary} mb-1`}>总资产 (HKD)</div>
          <div className="text-3xl font-bold mb-4">
            {MOCK_ACCOUNT.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className={colors.textSecondary}>证券市值</div>
              <div className="font-medium">{MOCK_ACCOUNT.marketValue.toLocaleString()}</div>
            </div>
            <div>
              <div className={colors.textSecondary}>现金余额</div>
              <div className="font-medium">{MOCK_ACCOUNT.cashBalance.toLocaleString()}</div>
            </div>
            <div>
              <div className={colors.textSecondary}>购买力</div>
              <div className="font-medium">{MOCK_ACCOUNT.buyingPower.toLocaleString()}</div>
            </div>
            <div>
              <div className={colors.textSecondary}>冻结资金</div>
              <div className="font-medium">{MOCK_ACCOUNT.frozenCash.toLocaleString()}</div>
            </div>
            <div>
              <div className={colors.textSecondary}>今日盈亏</div>
              <div className={`font-medium ${MOCK_ACCOUNT.todayProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {MOCK_ACCOUNT.todayProfitLoss >= 0 ? '+' : ''}{MOCK_ACCOUNT.todayProfitLoss.toLocaleString()}
              </div>
            </div>
            <div>
              <div className={colors.textSecondary}>累计盈亏</div>
              <div className={`font-medium ${MOCK_ACCOUNT.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {MOCK_ACCOUNT.totalProfitLoss >= 0 ? '+' : ''}{MOCK_ACCOUNT.totalProfitLoss.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 主题切换 */}
        <div className="px-4 mb-4">
          <div className={`${colors.bgCard} rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span>深色模式</span>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition ${theme === 'dark' ? 'bg-green-500' : 'bg-gray-300'} relative`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="px-4">
          <div className={`${colors.bgCard} rounded-xl divide-y ${colors.borderLight}`}>
            {[
              { icon: '💰', label: '资金明细', href: '#' },
              { icon: '📋', label: '交易记录', href: '/orders' },
              { icon: '📊', label: '资产分析', href: '#' },
              { icon: '🔔', label: '消息通知', href: '#' },
              { icon: '🔒', label: '安全设置', href: '#' },
              { icon: '❓', label: '帮助中心', href: '#' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-4 ${colors.hover} transition`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <svg className={`w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* 退出登录 */}
        <div className="px-4 mt-6">
          <button className="w-full py-3 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600/30 transition">
            退出登录
          </button>
        </div>

        {/* 版本信息 */}
        <div className={`text-center text-xs ${colors.textMuted} mt-6 pb-4`}>
          Trading App v1.0.0 (Demo)
        </div>
      </div>

      <BottomNav active="account" />
    </main>
  );
}
