'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      return 'dark';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 主题颜色配置 - Premium Finance Design System
// Accent: warm gold #C9A55C (primary), steel blue #5B8FA8 (secondary)
// Stock: red #e74c3c (up), green #27ae60 (down) — HK convention
export const themeColors = {
  dark: {
    bg: 'bg-[#0f1219]',
    bgSecondary: 'bg-[#161b26]',
    bgCard: 'bg-[#1a2030]/80',
    text: 'text-[#edf0f5]',
    textSecondary: 'text-[#edf0f5]/60',
    textMuted: 'text-[#edf0f5]/40',
    border: 'border-[#2a3344]',
    borderLight: 'border-[#232b3b]',
    hover: 'hover:bg-[#1e2636]',
    input: 'bg-[#1a2030]',
    navBg: 'bg-[#0f1219]/95',
    cardGradient: 'from-[#1e2636] to-[#161b26]',
    accent: 'text-[#C9A55C]',
    accentBg: 'bg-[#C9A55C]',
    accentBgSubtle: 'bg-[#C9A55C]/10',
    accentSecondary: 'text-[#5B8FA8]',
    accentSecondaryBg: 'bg-[#5B8FA8]',
  },
  light: {
    bg: 'bg-[#faf9f7]',
    bgSecondary: 'bg-white',
    bgCard: 'bg-white',
    text: 'text-[#1a1d23]',
    textSecondary: 'text-[#1a1d23]/60',
    textMuted: 'text-[#1a1d23]/40',
    border: 'border-[#e8e5df]',
    borderLight: 'border-[#f0ede8]',
    hover: 'hover:bg-[#f5f3ef]',
    input: 'bg-[#f5f3ef]',
    navBg: 'bg-[#faf9f7]/95',
    cardGradient: 'from-[#f5f3ef] to-white',
    accent: 'text-[#A8862E]',
    accentBg: 'bg-[#A8862E]',
    accentBgSubtle: 'bg-[#A8862E]/10',
    accentSecondary: 'text-[#4A7A90]',
    accentSecondaryBg: 'bg-[#4A7A90]',
  },
};
