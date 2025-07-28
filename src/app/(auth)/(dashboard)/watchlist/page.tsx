import Link from "next/link";
import { getUserWatchlistAction } from "@/actions/watchlist";
import { getBulkQuotes } from "@/api/alpha-vantage";
import { WatchlistRemoveButton } from "@/components/watchlist-remove-button";

export default async function WatchlistPage() {
  const watchlistResult = await getUserWatchlistAction();

  let content;

  if (!watchlistResult.success) {
    content = (
      <ErrorState
        message={watchlistResult.error || "Unable to load watchlist"}
      />
    );
  } else if (!watchlistResult.data || watchlistResult.data.length === 0) {
    content = <EmptyState />;
  } else {
    const symbols = watchlistResult.data.map((item) => item.symbol);
    const quotes = await getBulkQuotes(symbols);
    content = (
      <WatchlistGrid watchlist={watchlistResult.data} quotes={quotes} />
    );
  }

  return (
    <div className="p-6">
      <PageHeader />
      {content}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-primary">My Watchlist</h1>
      <p className="text-muted-foreground mt-2">
        Track your saved stocks and their performance
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-6 border rounded-lg bg-card text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-6 border rounded-lg bg-card text-center">
      <p className="text-muted-foreground mb-4">
        Your watchlist is empty. Start by searching for stocks to add to your
        watchlist.
      </p>
      <Link
        href="/stocks"
        className="text-accent hover:text-accent/80 font-medium"
      >
        Browse Stocks →
      </Link>
    </div>
  );
}

function WatchlistGrid({
  watchlist,
  quotes,
}: {
  watchlist: any[];
  quotes: Record<string, any>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {watchlist.map((item) => (
        <WatchlistCard key={item.id} item={item} quote={quotes[item.symbol]} />
      ))}
    </div>
  );
}

function WatchlistCard({ item, quote }: { item: any; quote: any }) {
  return (
    <div className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <Link
          href={`/stocks/${item.symbol}`}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          <div>
            <h3 className="font-semibold text-lg">{item.symbol}</h3>
            {quote && (
              <p className="text-sm text-muted-foreground">
                ${quote.price.toFixed(2)}
              </p>
            )}
          </div>
        </Link>

        <WatchlistRemoveButton symbol={item.symbol} />
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
    </div>
  );
}
