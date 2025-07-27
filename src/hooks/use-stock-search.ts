import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

interface StockSearchResult {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

interface StockSearchResponse {
  count: number;
  result: StockSearchResult[];
}

const fetcher = async (url: string): Promise<StockSearchResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch stock data');
  }
  return response.json();
};

export function useStockSearch(query: string) {
  const [debouncedQuery] = useDebounce(query.trim(), 300);
  
  const shouldFetch = debouncedQuery.length >= 2; // Only search if 2+ characters
  
  const { data, error, isLoading } = useSWR(
    shouldFetch 
      ? `https://finnhub.io/api/v1/search?q=${encodeURIComponent(debouncedQuery)}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes cache
      errorRetryCount: 2,
    }
  );

  return {
    data: data?.result || [],
    isLoading: shouldFetch && isLoading,
    error,
    hasResults: data?.result && data.result.length > 0,
  };
}