import Link from "next/link";
import { WatchlistRemoveButton } from "@/components/watchlist-remove-button";
import type { SelectWatchlist } from "@/db/schema";
import type { StockQuote } from "@/api/alpha-vantage";

interface WatchlistCardProps {
  item: SelectWatchlist;
  quote: StockQuote | null;
}

export function WatchlistCard({ item, quote }: WatchlistCardProps) {
  return (
    <div className="relative group">
      <Link
        href={`/stocks/${item.symbol}`}
        className="block p-4 border rounded-lg bg-card hover:shadow-md hover:border-accent/50 transition-all cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
              {item.symbol}
            </h3>
            {quote && (
              <p className="text-sm text-muted-foreground">
                ${quote.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {quote ? (
          <div className="space-y-2">
            <div
              className={`flex items-center gap-1 text-sm ${
                quote.change > 0
                  ? "text-green-600"
                  : quote.change < 0
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              <span>{quote.change > 0 ? "↗" : quote.change < 0 ? "↘" : "→"}</span>
              <span>
                ${Math.abs(quote.change).toFixed(2)} ({quote.changePercent})
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Added {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Unable to load quote data
          </div>
        )}
      </Link>
      
      {/* Remove button positioned absolutely in top right */}
      <div className="absolute top-2 right-2">
        <WatchlistRemoveButton symbol={item.symbol} />
      </div>
    </div>
  );
}

export function WatchlistCardSkeleton() {
  return (
    <div className="relative">
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="h-6 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
      {/* Skeleton for remove button */}
      <div className="absolute top-2 right-2">
        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}