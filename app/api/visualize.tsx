'use server'
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
import yahooFinance from 'yahoo-finance2';
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

  // Fetch 1-day intraday data (5-minute intervals)
  try{
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
  }catch (error){
    console.error("Error fetching stock data:", error);
  }
    
  const results = await yahooFinance.search('AAPL');
  // console.log(results)
  const oneday: "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo" = "1d";
  const queryOptions = { period1: '1000-01-01', interval: oneday};
  const daily = await yahooFinance.chart(ticker, queryOptions);
  const quotes = daily.quotes
  const historicalData : PriceVolumeData = [];
  for (const day  of quotes){
    const date = new Date(day.date);
    const formattedDate = date.toISOString().slice(0, 16);
    historicalData.push(
      {
        date: formattedDate,
        price: Number(day.adjclose),
        volume: Number(day.volume)
      }
    )
  }
  
// Populate different time ranges
  sampleData["5d"] = historicalData.slice(-5);
  sampleData["1m"] = historicalData.slice(-31);
  sampleData["6m"] = historicalData.slice(-182);
  sampleData["ytd"] = historicalData.filter((d) => d.date.startsWith("2025"));
  sampleData["1y"] = historicalData.slice(-365);
  sampleData["5y"] = historicalData.slice(-365 * 5);
  sampleData["max"] = historicalData; // Use all data

  return sampleData;
}

export async function checkTickerValidity(ticker: string){
  console.log('hi')
  try {
    await yahooFinance.search(ticker);
    return true;
  } catch (error) {
    console.error(`Error fetching data for ticker ${ticker}:`);
    return false;
  }
}