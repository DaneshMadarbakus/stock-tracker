import Link from "next/link";
import { StockSearch } from "@/components/stock-search";

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

export default function StocksPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Stock Search</h1>
        <p className="text-muted-foreground mt-2">
          Search for stocks by name or ticker symbol
        </p>
      </div>

      {/* Search Bar */}
      <StockSearch />

      {/* Popular Stocks */}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-4">
          Popular Stocks
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularStocks.map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stocks/${stock.symbol}`}
              className="p-4 border rounded-lg bg-card hover:border-accent/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
                    {stock.symbol}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {stock.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">--</div>
                  <div className="text-sm text-muted-foreground">--</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {stock.sector}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
