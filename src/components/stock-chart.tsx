"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

interface ChartDataPoint {
  timestamp: number;
  price: number;
  date: string;
}

interface StockChartProps {
  initialData: ChartDataPoint[];
  symbol: string;
}

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

export function StockChart({ initialData, symbol }: StockChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M");
  const [isLoading, setIsLoading] = useState(false);

  // Filter data based on selected time period
  const getFilteredData = (period: TimePeriod, rawData: ChartDataPoint[]) => {
    if (period === "All") return rawData;

    const now = Date.now() / 1000;
    const periodMap = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
    };
    const days = periodMap[period];
    const cutoff = now - days * 24 * 60 * 60;

    return rawData.filter((point) => point.timestamp >= cutoff);
  };

  const [data, setData] = useState(() => getFilteredData("1M", initialData));

  const periods: { value: TimePeriod; label: string; disabled?: boolean }[] = [
    { value: "1D", label: "1D", disabled: true },
    { value: "1W", label: "1W" },
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "1Y", label: "1Y" },
    { value: "All", label: "All" },
  ];

  const handlePeriodChange = async (period: TimePeriod) => {
    if (period === selectedPeriod) return;

    setSelectedPeriod(period);
    setIsLoading(true);

    try {
      const filteredData = getFilteredData(period, initialData);
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching period data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!data || data.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-card">
        <h3 className="font-semibold text-primary mb-2">Price Chart</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No chart data available
        </div>
      </div>
    );
  }

  // Calculate price change
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const percentChange = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-primary mb-1">Price Chart</h3>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
            </span>
            <span className="text-muted-foreground">
              {selectedPeriod} change
            </span>
          </div>
        </div>

        {/* Period Selection Buttons */}
        <div className="flex gap-1">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(period.value)}
              disabled={isLoading || period.disabled}
              className="h-8 px-3 text-xs"
              title={
                period.disabled
                  ? "Requires intraday data - coming soon"
                  : undefined
              }
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value: number) => [`$${value.toFixed(2)}`, symbol]}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Line
              type="linear"
              dataKey="price"
              stroke="#8b56ef"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "#8b56ef" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
