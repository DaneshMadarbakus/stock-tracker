export default function DashboardOverview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your stock tracking dashboard
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Portfolio Summary</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Recent Activity</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Market Overview</h3>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}