export default function SearchPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Search Stocks</h1>
        <p className="text-muted-foreground mt-2">
          Find and track your favorite stocks
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Stock Search</h3>
          <p className="text-muted-foreground">Search functionality coming soon...</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Search Results</h3>
          <p className="text-muted-foreground">Results will appear here...</p>
        </div>
      </div>
    </div>
  );
}