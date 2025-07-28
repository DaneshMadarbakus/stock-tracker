export interface PriceChangeInfo {
  change: number;
  changePercent: string;
  isPositive: boolean;
  isNegative: boolean;
  isUnchanged: boolean;
}

export function getPriceChangeInfo(
  currentPrice: number, 
  previousPrice: number, 
  changePercent?: string
): PriceChangeInfo {
  const change = currentPrice - previousPrice;
  
  return {
    change,
    changePercent: changePercent || `${((change / previousPrice) * 100).toFixed(2)}%`,
    isPositive: change > 0,
    isNegative: change < 0,
    isUnchanged: change === 0,
  };
}