'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// Mock 新闻数据
const MOCK_NEWS = [
  {
    id: '1',
    title: '小鹏（4Q25 纪要）：IRON 机器人目标到 2026 年底实现月产超过...',
    source: '长湾投研',
    time: '21 小时前',
    isPinned: true,
    hasImage: true,
    image: '🚗',
    tags: [],
  },
  {
    id: '2',
    title: '小鹏：只赚吆喝不赚钱，"东方特斯拉" 还讲得下去吗？',
    source: '长湾投研',
    time: '23 小时前',
    isPinned: true,
    hasImage: true,
    image: '🚘',
    tags: [],
  },
  {
    id: '3',
    title: '王文涛晤库克 冀苹果公司坚定在华发展信心',
    source: '7x24',
    time: '4 小时前',
    isPinned: false,
    hasImage: false,
    tags: [
      { name: '苹果', change: -0.39, isUp: false },
      { name: '苹果每日1倍...', change: 0.43, isUp: true },
    ],
  },
  {
    id: '4',
    title: '恒生大学租用宏安地产牛头角全幢新学生住宿大楼',
    source: '7x24',
    time: '4 小时前',
    isPinned: false,
    hasImage: false,
    tags: [
      { name: '宏安地产', change: -2.86, isUp: false },
    ],
  },
  {
    id: '5',
    title: '�power料联储局在今年底前会减息 3 次',
    source: '7x24',
    time: '9 小时前',
    isPinned: false,
    hasImage: false,
    tags: [],
  },
  {
    id: '6',
    title: '金价连跌 8 日 失守 4500 美元 创逾 1 个半月新低',
    source: '7x24',
    time: '11 小时前',
    isPinned: false,
    hasImage: false,
    tags: [],
  },
  {
    id: '7',
    title: '英伟达发布新一代 AI 芯片 Blackwell Ultra，性能提升 50%',
    source: '科技日报',
    time: '2 小时前',
    isPinned: false,
    hasImage: false,
    tags: [
      { name: 'NVDA', change: -3.15, isUp: false },
    ],
  },
  {
    id: '8',
    title: '腾讯控股回购 100 万股，耗资约 5.08 亿港元',
    source: '港交所公告',
    time: '5 小时前',
    isPinned: false,
    hasImage: false,
    tags: [
      { name: '腾讯', change: -0.59, isUp: false },
    ],
  },
];

export default function NewsPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  const [activeTab, setActiveTab] = useState<'headlines' | '7x24' | 'hot' | 'institutions'>('headlines');

  const tabs = [
    { key: 'headlines', label: '头条' },
    { key: '7x24', label: '7x24' },
    { key: 'hot', label: '热榜' },
    { key: 'institutions', label: '机构' },
  ];

  return (
    <main className={`min-h-screen ${colors.bg} ${colors.text} pb-20`}>
      {/* Header */}
      <div className={`${colors.bg} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">要闻</h1>
            <svg className={`w-4 h-4 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center gap-4">
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

        {/* Tab 切换 */}
        <div className={`px-4 flex gap-6 border-b ${colors.border}`}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.key
                  ? `border-current ${colors.text}`
                  : `border-transparent ${colors.textMuted}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 新闻列表 */}
        <div className={`divide-y ${colors.borderLight}`}>
          {MOCK_NEWS.map(news => (
            <article key={news.id} className={`px-4 py-4 ${colors.hover}`}>
              <div className="flex gap-3">
                {/* 左侧内容 */}
                <div className="flex-1 min-w-0">
                  {/* 标题 */}
                  <h3 className={`font-medium ${colors.text} leading-snug mb-2`}>
                    {news.title}
                  </h3>
                  
                  {/* 来源和时间 */}
                  <div className={`flex items-center gap-2 text-sm ${colors.textMuted}`}>
                    {news.isPinned && (
                      <span className="text-green-500 font-medium">置顶</span>
                    )}
                    <span>{news.source}</span>
                    <span>·</span>
                    <span>{news.time}</span>
                  </div>
                  
                  {/* 相关股票标签 */}
                  {news.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {news.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-sm ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                          }`}
                        >
                          <span className={colors.text}>{tag.name}</span>
                          <span className={`ml-1 ${tag.isUp ? 'text-green-500' : 'text-red-500'}`}>
                            {tag.isUp ? '+' : ''}{tag.change.toFixed(2)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 右侧图片 */}
                {news.hasImage && (
                  <div className={`w-24 h-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center text-3xl flex-shrink-0`}>
                    {news.image}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* 加载更多 */}
        <div className={`text-center py-6 text-sm ${colors.textMuted}`}>
          上拉加载更多
        </div>
      </div>

      <BottomNav active="news" />
    </main>
  );
}
