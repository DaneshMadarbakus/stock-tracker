"use client";

import { useFinnhubWebSocket } from "@/hooks/use-finnhub-websocket";
import type { USMarketStatus } from "@/api/alpha-vantage";

interface LiveStockPriceProps {
  symbol: string;
  fallbackPrice?: number;
  fallbackDate?: string;
  marketStatus: USMarketStatus;
  exchangeName: string;
}

export function LiveStockPrice({
  symbol,
  fallbackPrice,
  fallbackDate,
  marketStatus,
  exchangeName,
}: LiveStockPriceProps) {
  const marketOpen = marketStatus.isOpen;
  const { price, previousPrice, timestamp, isConnected, error } =
    useFinnhubWebSocket(symbol, {
      enabled: marketOpen,
    });

  const hasIncrease = price > previousPrice;
  const hasDecrease = price < previousPrice;

  // Use live data when market is open and connected, otherwise use fallback
  const displayPrice = marketOpen && isConnected ? price : fallbackPrice || 0;

  // Format timestamps consistently
  const getFormattedTime = () => {
    if (marketOpen && isConnected && timestamp > 0) {
      // Finnhub WebSocket returns timestamps in milliseconds, not seconds
      return `Live update: ${new Date(timestamp).toLocaleTimeString()}`;
    } else if (fallbackDate) {
      // Try to parse fallbackDate as a proper date
      const date = new Date(fallbackDate);
      if (!isNaN(date.getTime())) {
        return `Previous close: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
      return `Previous close: ${fallbackDate}`;
    }
    return null;
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Live Price</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {!marketOpen
              ? `${exchangeName} Closed`
              : isConnected
              ? "Live"
              : error
              ? "Error"
              : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Market Hours Notice */}
      {!marketOpen && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-sm text-amber-800">
              {exchangeName} Closed - Live data available {marketStatus.hours}
            </span>
          </div>
        </div>
      )}

      {/* Price Display */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-3xl font-bold ${
              hasIncrease
                ? "text-green-600"
                : hasDecrease
                ? "text-red-600"
                : "text-primary"
            }`}
          >
            {displayPrice > 0 ? `$${displayPrice.toFixed(2)}` : "--"}
          </span>

          {/* Price Change Indicator */}
          {marketOpen &&
            isConnected &&
            (hasIncrease ? (
              <span className="text-green-600">↗</span>
            ) : hasDecrease ? (
              <span className="text-red-600">↘</span>
            ) : (
              <span className="text-gray-500">—</span>
            ))}

          <span className="text-muted-foreground">USD</span>
          {!marketOpen && displayPrice > 0 && (
            <span className="text-xs text-muted-foreground bg-amber-100 px-2 py-1 rounded">
              Last Close
            </span>
          )}
        </div>

        {/* Timestamp */}
        {getFormattedTime() && (
          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {getFormattedTime()}
            </span>
          </div>
        )}
      </div>

      {/* Connection status */}
      {!isConnected && marketOpen && (
        <div className="mt-4 text-center">
          <span className="text-xs text-muted-foreground">
            {error ? `Error: ${error}` : "Connecting to live data..."}
          </span>
        </div>
      )}
    </div>
  );
}
