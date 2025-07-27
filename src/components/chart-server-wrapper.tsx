import { getHistoricalDataAV } from "@/api/alpha-vantage";
import { StockChart } from "./stock-chart";

interface ChartServerWrapperProps {
  symbol: string;
}

export async function ChartServerWrapper({ symbol }: ChartServerWrapperProps) {
  const historicalData = await getHistoricalDataAV(symbol); // Get all available data
  
  return <StockChart initialData={historicalData} symbol={symbol} />;
}