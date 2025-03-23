'use server'
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const ALPHA_VANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

type PriceVolumeData = { date: string; price: number; volume: number }[];

export default async function visualData(ticker: string): Promise<Record<string, PriceVolumeData>> {
  const sampleData: Record<string, PriceVolumeData> = {
    "1d": [],
    "5d": [],
    "1m": [],
    "6m": [],
    "ytd": [],
    "1y": [],
    "5y": [],
    "max": [],
  };

  try {
    // Fetch 1-day intraday data (5-minute intervals)
    const intradayResponse = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol: ticker,
        interval: "5min",
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const intradayData = intradayResponse.data["Time Series (5min)"];
    if (!intradayData) throw new Error("No intraday data received");

    sampleData["1d"] = Object.entries(intradayData).map(([timestamp, values]) => {
      if (typeof values !== "object" || values === null) {
        throw new Error(`Unexpected data format for timestamp: ${timestamp}`);
      }
    
      const typedValues = values as Record<string, string>;
    
      return {
        date: timestamp,
        price: parseFloat(typedValues["4. close"]),
        volume: parseInt(typedValues["5. volume"], 10),
      };
    });
    
    // Fetch historical daily data
    const dailyResponse = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: ticker,
        outputsize: "full",
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });


    const dailyData = dailyResponse.data["Time Series (Daily)"];
    if (!dailyData) throw new Error("No daily data received");

    // Convert daily data to array
    const historicalData = Object.entries(dailyData).map(([date, values]) => {
      const typedValues = values as { "4. close": string; "6. volume": string };
      return {
        date,
        price: parseFloat(typedValues["4. close"]),
        volume: parseInt(typedValues["6. volume"]),
      };
    });
    
    // Populate different time ranges
    sampleData["5d"] = historicalData.slice(0, 5);
    sampleData["1m"] = historicalData.slice(0, 22);
    sampleData["6m"] = historicalData.slice(0, 132);
    sampleData["ytd"] = historicalData.filter((d) => d.date.startsWith("2024"));
    sampleData["1y"] = historicalData.slice(0, 252);
    sampleData["5y"] = historicalData.slice(0, 252 * 5);
    sampleData["max"] = historicalData; // Use all data

    return sampleData;
    console.log(sampleData)
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return sampleData; 
  }
}