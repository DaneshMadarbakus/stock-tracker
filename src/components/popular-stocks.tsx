import Link from "next/link";
import { getBulkQuotes } from "@/api/alpha-vantage";
import { getPriceChangeInfo } from "@/lib/price-utils";

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment" },
];

export async function PopularStocks() {
  const symbols = popularStocks.map((stock) => stock.symbol);
  const quotes = await getBulkQuotes(symbols);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {popularStocks.map((stock) => (
        <StockCard key={stock.symbol} {...stock} quote={quotes[stock.symbol]} />
      ))}
    </div>
  );
}

function StockCard({
  symbol,
  name,
  sector,
  quote,
}: {
  symbol: string;
  name: string;
  sector: string;
  quote: any;
}) {
  if (!quote) {
    return <StockCardSkeleton symbol={symbol} name={name} sector={sector} />;
  }

  const priceInfo = getPriceChangeInfo(
    quote.price,
    quote.previousClose,
    quote.changePercent
  );

  return (
    <Link
      href={`/stocks/${symbol}`}
      className="p-4 border rounded-lg bg-card hover:border-accent/50 transition-colors group"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
            {symbol}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{name}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">${quote.price.toFixed(2)}</div>
          <div
            className={`text-sm flex items-center gap-1 ${
              priceInfo.isPositive
                ? "text-green-600"
                : priceInfo.isNegative
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {priceInfo.isPositive && (
              <>
                ↗ +${Math.abs(priceInfo.change).toFixed(2)} (
                {priceInfo.changePercent})
              </>
            )}
            {priceInfo.isNegative && (
              <>
                ↘ ${priceInfo.change.toFixed(2)} ({priceInfo.changePercent})
              </>
            )}
            {priceInfo.isUnchanged && <>—</>}
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{sector}</div>
    </Link>
  );
}

function StockCardSkeleton({
  symbol,
  name,
  sector,
}: {
  symbol: string;
  name: string;
  sector: string;
}) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-primary">{symbol}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{name}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-muted-foreground animate-pulse">
            Loading...
          </div>
          <div className="text-sm text-muted-foreground animate-pulse">--</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{sector}</div>
    </div>
  );
}

export function PopularStocksSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {popularStocks.map((stock) => (
        <StockCardSkeleton key={stock.symbol} {...stock} />
      ))}
    </div>
  );
}
