interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = process.env.FINNHUB_BASE_URL;

export async function getCompanyProfile(
  symbol: string
): Promise<CompanyProfile | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours - company data rarely changes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch company profile");
    }

    const data = await response.json();

    // Check if we got valid data
    if (!data.name) {
      return null;
    }

    return data as CompanyProfile;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
}
