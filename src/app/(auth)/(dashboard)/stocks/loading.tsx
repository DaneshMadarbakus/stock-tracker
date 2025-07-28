export default function StocksLoading() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Stock Search</h1>
        <p className="text-muted-foreground mt-2">
          Search for stocks by name or ticker symbol
        </p>
      </div>

      {/* Market Status Banner Skeleton */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="max-w-md">
        <div className="h-10 bg-muted animate-pulse rounded" />
      </div>

      {/* Popular Stocks Skeleton */}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-4">
          Popular Stocks
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="h-5 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </div>
                <div className="text-right">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}