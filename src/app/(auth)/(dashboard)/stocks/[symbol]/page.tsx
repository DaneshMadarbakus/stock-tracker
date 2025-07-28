import { Suspense } from "react";
import { BackButton } from "@/components/back-button";
import { CompanyInfo } from "@/components/company-info";
import { LiveStockPrice } from "@/components/live-stock-price";
import { ChartServerWrapper } from "@/components/chart-server-wrapper";
import { ChartSkeleton } from "@/components/chart-skeleton";
import { AddToWatchlistButton } from "@/components/add-to-watchlist-button";
import {
  getCompanyOverview,
  getUSMarketStatus,
  getQuote,
} from "@/api/alpha-vantage";
import { stackServerApp } from "@/stack";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const user = await stackServerApp.getUser();
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  const companyOverview = await getCompanyOverview(symbol);

  if (!companyOverview) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Stock Not Found
          </h1>
          <p className="text-muted-foreground">
            Could not find data for symbol &quot;{symbol}&quot;. Please check
            the symbol and try again.
          </p>
        </div>
      </div>
    );
  }

  // Get US market status (cleaner interface)
  const marketStatus = await getUSMarketStatus();

  // Only fetch quote when market is closed (for last close price)
  // When open, we use WebSocket for live data
  const quote = !marketStatus.isOpen ? await getQuote(symbol) : null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <BackButton />

        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{symbol}</h1>
            <p className="text-muted-foreground mt-2">
              {companyOverview.name} • Real-time data and company information
            </p>
          </div>
          <AddToWatchlistButton symbol={symbol} userId={user?.id || null} />
        </div>
      </div>

      <div className="space-y-8">
        {/* Live Price Section */}
        <LiveStockPrice
          symbol={symbol}
          fallbackPrice={quote?.previousClose}
          fallbackDate={quote?.tradingDay}
          marketStatus={marketStatus}
          exchangeName={companyOverview.exchange}
        />

        {/* Company Information */}
        <CompanyInfo overview={companyOverview} />

        {/* Price Chart with Suspense */}
        <Suspense fallback={<ChartSkeleton />}>
          <ChartServerWrapper symbol={symbol} />
        </Suspense>
      </div>
    </div>
  );
}
