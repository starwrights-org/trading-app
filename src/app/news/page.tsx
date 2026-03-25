'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 7x24 新闻数据
const NEWS_7X24 = [
  { id: '1', time: '20:07', title: '汇丰：维持美联储今明两年按兵不动的预期', content: '汇丰银行表示，美联储在3月份的会议上再次维持政策利率不变...', tags: [{ name: 'HSBC', change: -2.38 }] },
  { id: '2', time: '20:02', title: '伊拉克称伊朗天然气供应恢复，日供应量为500万立方米', content: '', tags: [] },
  { id: '3', time: '20:00', title: '卢拉敦促巴西建立战略石油储备', content: '当地时间3月20日，巴西总统卢拉表示需要建立战略石油储备...', tags: [{ name: 'PBR', change: -4.95 }] },
  { id: '4', time: '19:38', title: '伊朗货币大幅升值', content: '周六，伊朗货币里亚尔大幅上涨，反映出市场对外汇流入的预期...', tags: [] },
];

// 头条新闻
const NEWS_HEADLINES = [
  { id: '1', title: '小鹏（4Q25纪要）：IRON机器人目标到2026年底实现月产超过1000台', source: '长湾投研', time: '21小时前', pinned: true },
  { id: '2', title: '王文涛晤库克 冀苹果公司坚定在华发展信心', source: '7x24', time: '4小时前', tags: [{ name: 'AAPL', change: -0.39 }] },
  { id: '3', title: '英伟达发布新一代AI芯片Blackwell Ultra，性能提升50%', source: '科技日报', time: '2小时前', tags: [{ name: 'NVDA', change: -3.15 }] },
  { id: '4', title: '腾讯控股回购100万股，耗资约5.08亿港元', source: '港交所公告', time: '5小时前', tags: [{ name: '00700', change: -0.59 }] },
];

export default function NewsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#0f1219]' : 'bg-[#faf9f7]';
  
  const [activeTab, setActiveTab] = useState<'headlines' | '7x24' | 'hot'>('headlines');

  const tabs = [
    { key: 'headlines', label: '头条' },
    { key: '7x24', label: '7x24' },
    { key: 'hot', label: '热榜' },
  ];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0f1219] text-[#edf0f5]' : 'bg-[#faf9f7] text-[#1a1d23]'} pb-20`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-[#0f1219]' : 'bg-[#faf9f7]'} sticky top-0 z-10`}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">动态</h1>
            <Link href="/search" className={`p-2 rounded-full ${isDark ? 'hover:bg-[#1e2636]' : 'hover:bg-[#1a1d23]/5'} transition`}>
              <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Tab 切换 - 胶囊式 */}
        <div className="max-w-lg mx-auto px-5 pb-4">
          <div className={`inline-flex p-1 rounded-xl ${isDark ? 'bg-[#1a2030]' : 'bg-[#1a1d23]/5'}`}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? isDark ? 'bg-[#C9A55C] text-[#0f1219]' : 'bg-[#A8862E] text-white'
                    : 'text-[#1a1d23]/50 hover:text-[#1a1d23]/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5">
        {/* 头条 Tab */}
        {activeTab === 'headlines' && (
          <div className="space-y-3">
            {NEWS_HEADLINES.map(news => (
              <article key={news.id} className={`p-4 rounded-xl transition-all ${
                isDark 
                  ? 'bg-[#1a2030]/80 hover:bg-[#1e2636] border border-[#2a3344]' 
                  : 'bg-white hover:bg-[#faf9f7] border border-[#f0ede8] shadow-sm'
              }`}>
                <div className="flex items-start gap-3">
                  {news.pinned && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-[#27ae60]/10 text-[#27ae60] rounded-full">
                      置顶
                    </span>
                  )}
                </div>
                <h3 className={`font-medium leading-snug ${news.pinned ? 'mt-2' : ''}`}>
                  {news.title}
                </h3>
                <div className={`flex items-center gap-2 mt-3 text-sm ${isDark ? 'text-[#edf0f5]/40' : 'text-[#1a1d23]/40'}`}>
                  <span>{news.source}</span>
                  <span>·</span>
                  <span>{news.time}</span>
                </div>
                {news.tags && news.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {news.tags.map((tag, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-lg text-sm ${
                        isDark ? 'bg-[#1a2030]' : 'bg-[#f0ede8]'
                      }`}>
                        <span className={isDark ? 'text-[#edf0f5]/70' : 'text-[#1a1d23]/70'}>{tag.name}</span>
                        <span className={`ml-1.5 ${tag.change >= 0 ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                          {tag.change >= 0 ? '+' : ''}{tag.change.toFixed(2)}%
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* 7x24 Tab */}
        {activeTab === '7x24' && (
          <div className="space-y-1">
            {/* 日期标题 */}
            <div className={`py-3 text-sm font-medium ${isDark ? 'text-[#edf0f5]/50' : 'text-[#1a1d23]/50'}`}>
              03月21日 今天
            </div>
            
            {NEWS_7X24.map((news, idx) => (
              <article key={news.id} className="flex gap-4 py-4">
                {/* 时间线 */}
                <div className="flex flex-col items-center">
                  <span className={`text-sm tabular-nums ${isDark ? 'text-[#edf0f5]/40' : 'text-[#1a1d23]/40'}`}>
                    {news.time}
                  </span>
                  {idx < NEWS_7X24.length - 1 && (
                    <div className={`flex-1 w-px mt-2 ${isDark ? 'bg-[#1e2636]' : 'bg-[#e8e5df]'}`} />
                  )}
                </div>
                
                {/* 内容 */}
                <div className="flex-1 pb-4">
                  <h3 className="font-medium leading-snug">{news.title}</h3>
                  {news.content && (
                    <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-[#edf0f5]/50' : 'text-[#1a1d23]/50'}`}>
                      {news.content}
                      <span className="text-[#5B8FA8] ml-1 cursor-pointer">展开</span>
                    </p>
                  )}
                  {news.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {news.tags.map((tag, tidx) => (
                        <span key={tidx} className={`px-2 py-1 rounded-lg text-sm ${
                          isDark ? 'bg-[#1a2030]' : 'bg-[#f0ede8]'
                        }`}>
                          <span className={isDark ? 'text-[#edf0f5]/70' : 'text-[#1a1d23]/70'}>{tag.name}</span>
                          <span className={`ml-1.5 text-[#e74c3c]`}>
                            {tag.change.toFixed(2)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 热榜 Tab */}
        {activeTab === 'hot' && (
          <div className="py-16 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDark ? 'bg-[#1a2030]' : 'bg-[#f0ede8]'} flex items-center justify-center`}>
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-[#edf0f5]' : 'text-[#1a1d23]'}`}>热榜</h2>
            <p className={`mt-2 ${isDark ? 'text-[#edf0f5]/50' : 'text-[#1a1d23]/50'}`}>敬请期待</p>
          </div>
        )}
      </div>

      <BottomNav active="news" />
    </main>
  );
}
