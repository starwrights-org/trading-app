import StockDetailClient from './StockDetailClient';
import stocksData from '../../../../../public/data/stocks.json';

// 股票类型
interface Stock {
  symbol: string;
  name: string;
  market: 'US' | 'HK';
}

// 为静态导出生成所有股票路径
export function generateStaticParams() {
  const stocks = stocksData as Stock[];
  return stocks.map(stock => ({
    market: stock.market,
    symbol: stock.symbol,
  }));
}

export default async function StockDetailPage({ params }: { params: Promise<{ market: string; symbol: string }> }) {
  const { market, symbol } = await params;
  return <StockDetailClient market={market} symbol={symbol} />;
}
