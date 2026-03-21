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
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
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

// 主题颜色配置
export const themeColors = {
  dark: {
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    bgCard: 'bg-gray-800/50',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    textMuted: 'text-gray-500',
    border: 'border-gray-800',
    borderLight: 'border-gray-700',
    hover: 'hover:bg-gray-800',
    input: 'bg-gray-800',
    navBg: 'bg-gray-900',
    cardGradient: 'from-blue-900/50 to-purple-900/50',
  },
  light: {
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    bgCard: 'bg-gray-100',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-400',
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    hover: 'hover:bg-gray-100',
    input: 'bg-gray-100',
    navBg: 'bg-white',
    cardGradient: 'from-blue-50 to-purple-50',
  },
};
