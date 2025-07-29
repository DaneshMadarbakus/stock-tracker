import Link from "next/link";
import { Suspense } from "react";
import { getUserWatchlistAction } from "@/actions/watchlist";
import { WatchlistWithQuotes, WatchlistGridSkeleton } from "@/components/watchlist-grid";

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
    content = (
      <Suspense fallback={<WatchlistGridSkeleton />}>
        <WatchlistWithQuotes watchlist={watchlistResult.data} />
      </Suspense>
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

