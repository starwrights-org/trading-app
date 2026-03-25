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

// 主题颜色配置 - 现代设计系统
export const themeColors = {
  dark: {
    bg: 'bg-[#0a0a0a]',
    bgSecondary: 'bg-[#111]',
    bgCard: 'bg-white/[0.03]',
    text: 'text-white',
    textSecondary: 'text-white/60',
    textMuted: 'text-white/40',
    border: 'border-white/[0.06]',
    borderLight: 'border-white/[0.04]',
    hover: 'hover:bg-white/[0.06]',
    input: 'bg-white/5',
    navBg: 'bg-[#0a0a0a]/95',
    cardGradient: 'from-white/[0.08] to-white/[0.03]',
  },
  light: {
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    bgCard: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-400',
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    hover: 'hover:bg-gray-100',
    input: 'bg-gray-100',
    navBg: 'bg-white/95',
    cardGradient: 'from-gray-100 to-white',
  },
};
