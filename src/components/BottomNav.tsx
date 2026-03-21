'use client';

import Link from 'next/link';
import { useTheme, themeColors } from '@/lib/theme';

interface BottomNavProps {
  active: 'home' | 'market' | 'news' | 'positions' | 'account';
}

export default function BottomNav({ active }: BottomNavProps) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const navItems = [
    { key: 'home', icon: '📋', label: '关注', href: '/' },
    { key: 'market', icon: '🌐', label: '市场', href: '/market' },
    { key: 'news', icon: '📰', label: '动态', href: '/news' },
    { key: 'positions', icon: '💰', label: '资产', href: '/positions' },
    { key: 'account', icon: '👤', label: '我的', href: '/account' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${colors.navBg} border-t ${colors.border}`}>
      <div className="max-w-lg mx-auto flex">
        {navItems.map(item => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-2 ${
              active === item.key 
                ? 'text-green-500' 
                : `${colors.textMuted} hover:${colors.textSecondary}`
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
