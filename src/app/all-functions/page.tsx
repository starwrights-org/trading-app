'use client';

import Link from 'next/link';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 功能分类配置
const FUNCTION_CATEGORIES = [
  {
    title: '资产',
    items: [
      { icon: '💳', label: '存入资金', href: '#', color: 'bg-blue-500' },
      { icon: '💸', label: '提取资金', href: '#', color: 'bg-blue-500' },
      { icon: '💱', label: '货币兑换', href: '/currency-exchange', color: 'bg-yellow-500' },
      { icon: '📥', label: '转入股票', href: '#', color: 'bg-blue-500' },
      { icon: '🔄', label: '资金划转', href: '#', color: 'bg-blue-500' },
      { icon: '💳', label: '银行卡', href: '#', color: 'bg-blue-500' },
      { icon: '📤', label: '转出股票', href: '#', color: 'bg-blue-500' },
    ],
  },
  {
    title: '交易',
    items: [
      { icon: '🏛', label: '交易大厅', href: '/trading-hall', color: 'bg-blue-500' },
      { icon: '📰', label: '新股申购', href: '#', color: 'bg-red-500' },
    ],
  },
  {
    title: '记录',
    items: [
      { icon: '📋', label: '订单查询', href: '/orders', color: 'bg-blue-500' },
      { icon: '📊', label: '资金记录', href: '/fund-records', color: 'bg-blue-500' },
    ],
  },
  {
    title: '账户',
    items: [
      { icon: '📈', label: '基金风险水平', href: '#', color: 'bg-blue-500' },
      { icon: '💎', label: 'PI 专区', href: '#', color: 'bg-blue-500' },
      { icon: '📄', label: '更新文件', href: '#', color: 'bg-red-500' },
    ],
  },
];

export default function AllFunctionsPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

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
          <h1 className="flex-1 text-center text-lg font-medium">全部功能</h1>
          <button className="text-blue-500 text-sm">管理</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {FUNCTION_CATEGORIES.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            {/* 分类标题 */}
            <h2 className={`text-sm ${colors.textMuted} mb-3`}>{category.title}</h2>
            
            {/* 功能网格 */}
            <div className="grid grid-cols-4 gap-3">
              {category.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={`flex flex-col items-center p-4 ${colors.bgCard} rounded-xl ${colors.hover} transition`}
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                    <span className="text-2xl text-white filter drop-shadow">{item.icon}</span>
                  </div>
                  <span className={`text-xs ${colors.text} text-center`}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="positions" />
    </main>
  );
}
