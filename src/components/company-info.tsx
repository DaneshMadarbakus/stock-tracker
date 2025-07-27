import { Building2, Globe, MapPin, Calendar, DollarSign, Users } from "lucide-react";

interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

interface CompanyInfoProps {
  profile: CompanyProfile;
}

export function CompanyInfo({ profile }: CompanyInfoProps) {
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}T`;
    } else if (marketCap >= 1) {
      return `$${marketCap.toFixed(1)}B`;
    } else {
      return `$${(marketCap * 1000).toFixed(0)}M`;
    }
  };

  const formatShares = (shares: number) => {
    if (shares >= 1000) {
      return `${(shares / 1000).toFixed(1)}B`;
    } else {
      return `${shares.toFixed(1)}M`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="flex items-start gap-4">
        {profile.logo && (
          <img 
            src={profile.logo} 
            alt={`${profile.name} logo`}
            className="w-16 h-16 rounded-lg object-contain bg-background border"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-primary mb-2">{profile.name}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {profile.exchange}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.country}
            </span>
            {profile.finnhubIndustry && (
              <span>• {profile.finnhubIndustry}</span>
            )}
          </div>
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
            {formatMarketCap(profile.marketCapitalization)}
          </p>
        </div>

        {/* Shares Outstanding */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">Shares Outstanding</h3>
          </div>
          <p className="text-2xl font-semibold">
            {formatShares(profile.shareOutstanding)}
          </p>
        </div>

        {/* IPO Date */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-primary">IPO Date</h3>
          </div>
          <p className="text-2xl font-semibold">
            {new Date(profile.ipo).getFullYear()}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-primary mb-2">Exchange & Currency</h3>
          <p className="text-muted-foreground">
            Listed on {profile.exchange} • Traded in {profile.currency}
          </p>
        </div>

        {profile.weburl && (
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium text-primary mb-2">Website</h3>
            <a 
              href={profile.weburl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {profile.weburl.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}