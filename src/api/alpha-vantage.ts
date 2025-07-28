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

export interface MarketInfo {
  market_type: string;
  region: string;
  primary_exchanges: string;
  local_open: string;
  local_close: string;
  current_status: string;
  notes: string;
}

interface AlphaVantageMarketStatusResponse {
  markets: MarketInfo[];
}

export interface StockQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  tradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;
}

interface AlphaVantageQuoteResponse {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = process.env.ALPHA_VANTAGE_BASE_URL;

// Raw API call - pure data fetching
async function fetchAlphaVantageTimeSeries(
  symbol: string
): Promise<AlphaVantageResponse> {
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
export async function getHistoricalDataAV(
  symbol: string
): Promise<ChartDataPoint[]> {
  try {
    const rawData = await fetchAlphaVantageTimeSeries(symbol);
    return transformToChartData(rawData);
  } catch (error) {
    console.error("Error fetching historical data from Alpha Vantage:", error);
    return [];
  }
}

// Market status API
export async function getGlobalMarketStatus(): Promise<MarketInfo[]> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}/query?function=MARKET_STATUS&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch market status from Alpha Vantage");
    }

    const data: AlphaVantageMarketStatusResponse = await response.json();
    return data.markets || [];
  } catch (error) {
    console.error("Error fetching market status from Alpha Vantage:", error);
    return [];
  }
}

export interface USMarketStatus {
  isOpen: boolean;
  hours: string;
  status: string;
}

// US Market status - cleaner interface for US-focused app
export async function getUSMarketStatus(): Promise<USMarketStatus> {
  try {
    const allMarkets = await getGlobalMarketStatus();
    const usMarket =
      allMarkets.find((m) =>
        m.region.toLowerCase().includes("united states")
      ) ||
      allMarkets[0] ||
      null;

    if (!usMarket) {
      return {
        isOpen: false,
        hours: "9:30 AM - 4:00 PM ET",
        status: "unknown",
      };
    }

    return {
      isOpen: usMarket.current_status.toLowerCase() === "open",
      hours: `${usMarket.local_open} - ${usMarket.local_close} ET`,
      status: usMarket.current_status,
    };
  } catch (error) {
    console.error("Error fetching US market status:", error);
    return {
      isOpen: false,
      hours: "9:30 AM - 4:00 PM ET",
      status: "error",
    };
  }
}

export async function getBulkQuotes(
  symbols: string[]
): Promise<Record<string, StockQuote | null>> {
  try {
    // Make individual quote calls for each symbol
    const result: Record<string, StockQuote | null> = {};
    const promises = symbols.map(async (symbol) => {
      const quote = await getQuote(symbol);
      result[symbol] = quote;
    });

    await Promise.all(promises);
    return result;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    // Return empty results for all symbols on error
    const result: Record<string, StockQuote | null> = {};
    symbols.forEach((symbol) => {
      result[symbol] = null;
    });
    return result;
  }
}

// Quote API
export async function getQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds - good for browsing experience
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quote from Alpha Vantage");
    }

    const data: AlphaVantageQuoteResponse = await response.json();
    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return null;
    }

    // Return clean Alpha Vantage format
    return {
      symbol: quote["01. symbol"],
      open: parseFloat(quote["02. open"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      price: parseFloat(quote["05. price"]),
      volume: parseInt(quote["06. volume"]),
      tradingDay: quote["07. latest trading day"],
      previousClose: parseFloat(quote["08. previous close"]),
      change: parseFloat(quote["09. change"]),
      changePercent: quote["10. change percent"],
    };
  } catch (error) {
    console.error("Error fetching quote from Alpha Vantage:", error);
    return null;
  }
}

// Company Overview - Alpha Vantage native structure
export interface CompanyOverview {
  symbol: string;
  name: string;
  description: string;
  exchange: string;
  currency: string;
  country: string;
  sector: string;
  industry: string;
  address: string;
  website: string;
  marketCapitalization: number;
  sharesOutstanding: number;
  peRatio: number;
  eps: string;
  dividendYield: string;
  beta: string;
  fiftyTwoWeekHigh: string;
  fiftyTwoWeekLow: string;
}

interface AlphaVantageCompanyOverview {
  Symbol: string;
  Name: string;
  Description: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  OfficialSite: string;
  MarketCapitalization: string;
  SharesOutstanding: string;
  PERatio: string;
  EPS: string;
  DividendYield: string;
  Beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
}

export async function getCompanyOverview(
  symbol: string
): Promise<CompanyOverview | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        next: { revalidate: 21600 }, // Cache for 6 hours - balance between freshness and API limits
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch company overview");
    }

    const data: AlphaVantageCompanyOverview = await response.json();

    if (!data.Name || !data.Symbol) {
      return null;
    }

    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description || "",
      exchange: data.Exchange || "",
      currency: data.Currency || "USD",
      country: data.Country || "",
      sector: data.Sector || "",
      industry: data.Industry || "",
      address: data.Address || "",
      website: data.OfficialSite || "",
      marketCapitalization: parseFloat(data.MarketCapitalization || "0"),
      sharesOutstanding: parseFloat(data.SharesOutstanding || "0"),
      peRatio: parseFloat(data.PERatio || "0"),
      eps: data.EPS || "N/A",
      dividendYield: data.DividendYield || "N/A",
      beta: data.Beta || "N/A",
      fiftyTwoWeekHigh: data["52WeekHigh"] || "N/A",
      fiftyTwoWeekLow: data["52WeekLow"] || "N/A",
    };
  } catch (error) {
    console.error("Error fetching company overview:", error);
    return null;
  }
}
