interface AlphaVantageTimeSeriesData {
  [key: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
}

interface AlphaVantageResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
  };
  "Time Series (Daily)": AlphaVantageTimeSeriesData;
}

interface ChartDataPoint {
  timestamp: number;
  price: number;
  date: string;
}

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = process.env.ALPHA_VANTAGE_BASE_URL;

// Raw API call - pure data fetching
async function fetchAlphaVantageTimeSeries(symbol: string): Promise<AlphaVantageResponse> {
  const response = await fetch(
    `${ALPHA_VANTAGE_BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=full`,
    {
      next: { revalidate: 900 }, // Cache for 15 minutes - follows trading app patterns
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch historical data from Alpha Vantage");
  }

  return response.json();
}

// Data transformation - pure function
function transformToChartData(data: AlphaVantageResponse): ChartDataPoint[] {
  const timeSeries = data["Time Series (Daily)"];
  
  if (!timeSeries) {
    console.error("Alpha Vantage API response missing time series:", data);
    return [];
  }

  // Convert to our chart format and sort chronologically
  return Object.entries(timeSeries)
    .map(([date, values]) => ({
      timestamp: new Date(date).getTime() / 1000,
      price: parseFloat(values["4. close"]),
      date: new Date(date).toLocaleDateString(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

// Public API - orchestrates fetch + transform
export async function getHistoricalDataAV(symbol: string): Promise<ChartDataPoint[]> {
  try {
    const rawData = await fetchAlphaVantageTimeSeries(symbol);
    return transformToChartData(rawData);
  } catch (error) {
    console.error("Error fetching historical data from Alpha Vantage:", error);
    return [];
  }
}
