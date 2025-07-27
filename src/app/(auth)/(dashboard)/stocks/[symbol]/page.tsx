import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";

export default function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();

  return (
    <div className="p-6">
      <div className="mb-6">
        <BackButton />

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary">{symbol}</h1>
            <p className="text-muted-foreground mt-2">
              Stock details and real-time data
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            Add to Watchlist
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Current Price</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Price Chart</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Stock Details</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Key Metrics</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
