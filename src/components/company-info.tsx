import { Building2, Globe, MapPin, TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { type CompanyOverview } from "@/api/alpha-vantage";

interface CompanyInfoProps {
  overview: CompanyOverview;
}

export function CompanyInfo({ overview }: CompanyInfoProps) {
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(0)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatShares = (shares: number) => {
    if (shares >= 1000000000) {
      return `${(shares / 1000000000).toFixed(1)}B`;
    } else if (shares >= 1000000) {
      return `${(shares / 1000000).toFixed(1)}M`;
    } else {
      return shares.toLocaleString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-primary mb-2">{overview.name}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {overview.exchange}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {overview.country}
            </span>
            {overview.industry && (
              <span>• {overview.industry}</span>
            )}
          </div>
          {overview.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
              {overview.description}
            </p>
          )}
        </div>
      </div>

      {/* Company Details Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Market Cap */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">Market Cap</h3>
          </div>
          <p className="text-2xl font-semibold">
            {formatMarketCap(overview.marketCapitalization)}
          </p>
        </div>

        {/* Shares Outstanding */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">Shares Outstanding</h3>
          </div>
          <p className="text-2xl font-semibold">
            {formatShares(overview.sharesOutstanding)}
          </p>
        </div>

        {/* P/E Ratio */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">P/E Ratio</h3>
          </div>
          <p className="text-2xl font-semibold">
            {overview.peRatio > 0 ? overview.peRatio.toFixed(2) : "N/A"}
          </p>
        </div>

        {/* EPS */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">EPS</h3>
          </div>
          <p className="text-2xl font-semibold">
            ${overview.eps}
          </p>
        </div>

        {/* Beta */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">Beta</h3>
          </div>
          <p className="text-2xl font-semibold">
            {overview.beta}
          </p>
        </div>

        {/* 52 Week Range */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">52 Week Range</h3>
          </div>
          <p className="text-sm font-semibold">
            ${overview.fiftyTwoWeekLow} - ${overview.fiftyTwoWeekHigh}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-primary mb-2">Exchange & Currency</h3>
          <p className="text-muted-foreground">
            Listed on {overview.exchange} • Traded in {overview.currency}
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-primary mb-2">Sector & Industry</h3>
          <p className="text-muted-foreground">
            {overview.sector} • {overview.industry}
          </p>
        </div>

        {overview.dividendYield !== "N/A" && (
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium text-primary mb-2">Dividend Yield</h3>
            <p className="text-muted-foreground">
              {overview.dividendYield}
            </p>
          </div>
        )}

        {overview.website && (
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium text-primary mb-2">Website</h3>
            <a 
              href={overview.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {overview.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}