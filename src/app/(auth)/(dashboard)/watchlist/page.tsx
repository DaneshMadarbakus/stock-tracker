import { getUserWatchlistAction } from "@/actions/watchlist";

export default async function WatchlistPage() {
  const watchlist = await getUserWatchlistAction();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">My Watchlist</h1>
        <p className="text-muted-foreground mt-2">
          Track your saved stocks and their performance
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Watched Stocks</h3>
          <p className="text-muted-foreground">
            Your watchlist will appear here...
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">
            Performance Summary
          </h3>
          <p className="text-muted-foreground">
            Performance metrics coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
