import { MOCK_STOCKS } from '@/lib/mockData';
import StockDetailClient from './StockDetailClient';

// 为静态导出生成所有可能的路径
export function generateStaticParams() {
  return MOCK_STOCKS.map(stock => ({
    market: stock.market,
    symbol: stock.symbol,
  }));
}

export default async function StockDetailPage({ params }: { params: Promise<{ market: string; symbol: string }> }) {
  const { market, symbol } = await params;
  return <StockDetailClient market={market} symbol={symbol} />;
}
