import { getBulkQuotes, type StockQuote } from "@/api/alpha-vantage";
import { WatchlistCard, WatchlistCardSkeleton } from "@/components/watchlist-card";
import type { SelectWatchlist } from "@/db/schema";

interface WatchlistGridProps {
  watchlist: SelectWatchlist[];
  quotes: Record<string, StockQuote | null>;
}

export async function WatchlistWithQuotes({ watchlist }: { watchlist: SelectWatchlist[] }) {
  const symbols = watchlist.map((item) => item.symbol);
  const quotes = await getBulkQuotes(symbols);
  
  return <WatchlistGrid watchlist={watchlist} quotes={quotes} />;
}

export function WatchlistGrid({ watchlist, quotes }: WatchlistGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {watchlist.map((item) => (
        <WatchlistCard key={item.id} item={item} quote={quotes[item.symbol]} />
      ))}
    </div>
  );
}

export function WatchlistGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <WatchlistCardSkeleton key={i} />
      ))}
    </div>
  );
}