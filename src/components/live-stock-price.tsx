"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface LiveStockPriceProps {
  symbol: string;
}

export function LiveStockPrice({ symbol }: LiveStockPriceProps) {
  // TODO: Implement real-time price fetching with WebSocket
  // For now, showing placeholder
  
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Live Price</h3>
        <span className="text-xs text-muted-foreground">Real-time</span>
      </div>
      
      {/* Price Display */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">--</span>
          <span className="text-muted-foreground">USD</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">--</span>
            <span>(--%))</span>
          </div>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
        
        {/* Day Range */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Open: </span>
              <span className="font-medium">--</span>
            </div>
            <div>
              <span className="text-muted-foreground">High: </span>
              <span className="font-medium">--</span>
            </div>
            <div>
              <span className="text-muted-foreground">Low: </span>
              <span className="font-medium">--</span>
            </div>
            <div>
              <span className="text-muted-foreground">Prev Close: </span>
              <span className="font-medium">--</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="mt-4 text-center">
        <span className="text-xs text-muted-foreground">
          Connecting to live data...
        </span>
      </div>
    </div>
  );
}