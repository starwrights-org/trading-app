'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme, themeColors } from '@/lib/theme';
import BottomNav from '@/components/BottomNav';

// 7x24 新闻数据（带时间线）
const NEWS_7X24 = [
  {
    id: '1',
    time: '20:07',
    title: '汇丰：维持美联储今明两年按兵不动的预期',
    content: '汇丰银行表示，美联储在 3 月份的会议上再次维持政策利率不变，仍为 3.50%-3.75%，并暗示将采取 "观望" 态度。持续的通胀和不断上升的地缘政治风险给美...',
    hasExpand: true,
    tags: [
      { name: 'HSBH.US', change: -2.38, isUp: false },
      { name: '金融指数 MSC...', change: 0.13, isUp: true },
    ],
  },
  {
    id: '2',
    time: '20:02',
    title: '伊拉克称伊朗天然气供应恢复，日供应量为 500 万立方米。',
    content: '',
    hasExpand: false,
    tags: [
      { name: '2 倍做多彭博天...', change: -2.47, isUp: false },
      { name: '美国近 12 月...', change: 0.14, isUp: true },
    ],
  },
  {
    id: '3',
    time: '20:00',
    title: '卢拉敦促巴西建立战略石油储备',
    content: '当地时间 3 月 20 日，巴西总统卢拉在访问巴西米纳斯吉拉斯州一家炼油厂时表示，当前中东冲突加剧，巴西石油公司和政府 "需要建立战略石油储备"，以应对...',
    hasExpand: true,
    tags: [
      { name: '巴西石油公司', change: -4.95, isUp: false },
      { name: '2 倍做多巴西市...', change: -8.15, isUp: false },
    ],
  },
  {
    id: '4',
    time: '19:38',
    title: '伊朗货币大幅升值',
    content: '周六，伊朗货币里亚尔大幅上涨，反映出市场押注美国豁免伊朗石油销售将带来外汇流入。在美国财政部决定暂时取消对已在途的伊朗原油的限制后，里亚尔...',
    hasExpand: true,
    tags: [],
  },
];

// 机构新闻数据
const NEWS_INSTITUTIONS = [
  {
    id: '1',
    title: '汇丰：维持美联储今明两年按兵不动的预期',
    source: '7x24',
    time: '38 分钟前',
    tags: [
      { name: 'HSBH.US', change: -2.38, isUp: false },
      { name: '金融指数 MSC...', change: 0.13, isUp: true },
      { name: '汇丰', change: -3.16, isUp: false },
    ],
  },
  {
    id: '2',
    titleEn: 'Trump Administration Proposes New Emissions Regulations',
    titleCn: '特朗普政府提出新的排放法规',
    source: '7x24',
    time: '42 分钟前',
    tags: [
      { name: '美国低波动股指数...', change: -1.00, isUp: false },
      { name: '纳斯达克综合指数...', change: -1.99, isUp: false },
    ],
  },
  {
    id: '3',
    title: '马斯克：企业版 Grok Voice 现已推出。',
    source: '7x24',
    time: '1 小时前',
    tags: [
      { name: '标普软件与服务...', change: -1.42, isUp: false },
      { name: 'GXAI.US', change: -2.94, isUp: false },
    ],
  },
  {
    id: '4',
    title: '马斯克：xAI 的 "Grok Computer" 应用即将推出。',
    source: '7x24',
    time: '2 小时前',
    tags: [
      { name: 'DXYZ.US', change: -2.56, isUp: false },
    ],
  },
  {
    id: '5',
    title: '美光 2027 年 EPS 超 100 美元！巴克莱 "超级加倍" 预测，远超市场共识的 54 美元',
    source: '研报',
    time: '3 小时前',
    tags: [
      { name: 'MU', change: -1.85, isUp: false },
    ],
  },
];

// 头条新闻数据
const NEWS_HEADLINES = [
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
    id: '5',
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
  const [filter7x24, setFilter7x24] = useState<'all' | 'important'>('all');
  const [marketFilter, setMarketFilter] = useState<'all' | 'hk' | 'us'>('all');

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
                  ? `border-current ${colors.text} font-bold`
                  : `border-transparent ${colors.textMuted}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 7x24 Tab */}
        {activeTab === '7x24' && (
          <>
            {/* 日期和筛选 */}
            <div className={`px-4 py-3 flex items-center justify-between border-b ${colors.border}`}>
              <span className={colors.text}>03 月 21 日 / 今天</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilter7x24('all')}
                  className={filter7x24 === 'all' ? colors.text : colors.textMuted}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilter7x24('important')}
                  className={filter7x24 === 'important' ? colors.text : colors.textMuted}
                >
                  重要
                </button>
                <button className="flex items-center gap-1 text-sm">
                  <span className={colors.textMuted}>港美股</span>
                  <svg className={`w-4 h-4 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 7x24 时间线列表 */}
            <div className={`divide-y ${colors.borderLight}`}>
              {NEWS_7X24.map(news => (
                <article key={news.id} className={`px-4 py-4`}>
                  {/* 时间 */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`} />
                      <span className={`text-sm ${colors.textMuted} w-12`}>{news.time}</span>
                    </div>
                    <div className="flex-1">
                      {/* 标题 */}
                      <h3 className={`font-bold ${colors.text} leading-snug mb-2`}>
                        {news.title}
                      </h3>
                      
                      {/* 内容 */}
                      {news.content && (
                        <p className={`text-sm ${colors.textSecondary} leading-relaxed mb-2`}>
                          {news.content}
                          {news.hasExpand && (
                            <span className="text-cyan-500 ml-1">展开</span>
                          )}
                        </p>
                      )}
                      
                      {/* 标签和操作 */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {news.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-sm border ${colors.border}`}
                            >
                              <span className={tag.isUp ? 'text-green-500' : 'text-red-500'}>{tag.name} {tag.isUp ? '+' : ''}{tag.change.toFixed(2)}%</span>
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <button className={colors.textMuted}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          <button className={colors.textMuted}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* 机构 Tab */}
        {activeTab === 'institutions' && (
          <div className={`divide-y ${colors.borderLight}`}>
            {NEWS_INSTITUTIONS.map(news => (
              <article key={news.id} className={`px-4 py-4`}>
                {/* 标题 */}
                {'titleEn' in news ? (
                  <>
                    <h3 className={`font-bold ${colors.text} leading-snug`}>
                      {news.titleEn}
                    </h3>
                    <p className={`text-sm ${colors.textSecondary} mt-1 flex items-center gap-1`}>
                      <span className="text-cyan-500">中</span>
                      {news.titleCn}
                    </p>
                  </>
                ) : (
                  <h3 className={`font-bold ${colors.text} leading-snug`}>
                    {news.title}
                  </h3>
                )}
                
                {/* 来源和时间 */}
                <div className={`text-sm ${colors.textMuted} mt-2`}>
                  {news.source} · {news.time}
                </div>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {news.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-sm border ${colors.border}`}
                    >
                      <span className={tag.isUp ? 'text-green-500' : 'text-red-500'}>{tag.name} {tag.isUp ? '+' : ''}{tag.change.toFixed(2)}%</span>
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 头条 Tab */}
        {activeTab === 'headlines' && (
          <div className={`divide-y ${colors.borderLight}`}>
            {NEWS_HEADLINES.map(news => (
              <article key={news.id} className={`px-4 py-4 ${colors.hover}`}>
                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${colors.text} leading-snug mb-2`}>
                      {news.title}
                    </h3>
                    
                    <div className={`flex items-center gap-2 text-sm ${colors.textMuted}`}>
                      {news.isPinned && (
                        <span className="text-green-500 font-medium">置顶</span>
                      )}
                      <span>{news.source}</span>
                      <span>·</span>
                      <span>{news.time}</span>
                    </div>
                    
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
                  
                  {news.hasImage && (
                    <div className={`w-24 h-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center text-3xl flex-shrink-0`}>
                      {news.image}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 热榜 Tab - 占位 */}
        {activeTab === 'hot' && (
          <div className={`text-center py-20 ${colors.textMuted}`}>
            <div className="text-4xl mb-4">🔥</div>
            <div>热榜功能开发中</div>
          </div>
        )}

        {/* 加载更多 */}
        <div className={`text-center py-6 text-sm ${colors.textMuted}`}>
          上拉加载更多
        </div>
      </div>

      <BottomNav active="news" />
    </main>
  );
}
