import { Suspense } from "react";
import { StockSearch } from "@/components/stock-search";
import { PopularStocks, PopularStocksSkeleton } from "@/components/popular-stocks";
import { getUSMarketStatus } from "@/api/alpha-vantage";

export default async function StocksPage() {
  const marketStatus = await getUSMarketStatus();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Stock Search</h1>
        <p className="text-muted-foreground mt-2">
          Search for stocks by name or ticker symbol
        </p>
      </div>

      {/* Market Status Banner */}
      <div className={`p-4 rounded-lg border ${
        marketStatus.isOpen 
          ? 'bg-green-50 border-green-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            marketStatus.isOpen ? 'bg-green-500' : 'bg-amber-500'
          }`} />
          <span className={`text-sm font-medium ${
            marketStatus.isOpen ? 'text-green-800' : 'text-amber-800'
          }`}>
            US Market {marketStatus.isOpen ? 'Open' : 'Closed'} • Trading hours: {marketStatus.hours}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <StockSearch />

      {/* Popular Stocks */}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-4">
          Popular Stocks
        </h2>
        <Suspense fallback={<PopularStocksSkeleton />}>
          <PopularStocks />
        </Suspense>
      </div>
    </div>
  );
}
