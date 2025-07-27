import { Suspense } from "react";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { CompanyInfo } from "@/components/company-info";
import { LiveStockPrice } from "@/components/live-stock-price";
import { ChartServerWrapper } from "@/components/chart-server-wrapper";
import { ChartSkeleton } from "@/components/chart-skeleton";
import { getCompanyProfile } from "@/api/finnhub";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  const companyProfile = await getCompanyProfile(symbol);

  if (!companyProfile) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Stock Not Found
          </h1>
          <p className="text-muted-foreground">
            Could not find data for symbol "{symbol}". Please check the symbol
            and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <BackButton />

        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{symbol}</h1>
            <p className="text-muted-foreground mt-2">
              {companyProfile.name} • Real-time data and company information
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            Add to Watchlist
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Live Price Section */}
        <LiveStockPrice symbol={symbol} />

        {/* Company Information */}
        <CompanyInfo profile={companyProfile} />

        {/* Price Chart with Suspense */}
        <Suspense fallback={<ChartSkeleton />}>
          <ChartServerWrapper symbol={symbol} />
        </Suspense>
      </div>
    </div>
  );
}
