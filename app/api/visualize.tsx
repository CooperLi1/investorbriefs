'use server';

import yahooFinance from 'yahoo-finance2';
import { fetchTrustedJson, getRequiredEnv, requireSignedInUser } from '@/app/lib/server-security';
import { normalizeTicker } from '@/app/lib/validation';

type PriceVolumeData = { date: string; price: number; volume: number }[];

const MAX_CHART_POINTS = 10000;

function createEmptyRanges(): Record<string, PriceVolumeData> {
  return {
    '1d': [],
    '5d': [],
    '1m': [],
    '6m': [],
    ytd: [],
    '1y': [],
    '5y': [],
    max: [],
  };
}

function toFiniteNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function visualData(ticker: string): Promise<Record<string, PriceVolumeData>> {
  await requireSignedInUser();

  const symbol = normalizeTicker(ticker);
  const sampleData = createEmptyRanges();

  try {
    const intradayUrl = new URL('https://www.alphavantage.co/query');
    intradayUrl.search = new URLSearchParams({
      function: 'TIME_SERIES_INTRADAY',
      symbol,
      interval: '5min',
      apikey: getRequiredEnv('ALPHAVANTAGE_API_KEY'),
    }).toString();

    const intradayResponse = await fetchTrustedJson(intradayUrl, { maxBytes: 500_000 });
    const intradayData =
      intradayResponse && typeof intradayResponse === 'object'
        ? (intradayResponse as Record<string, unknown>)['Time Series (5min)']
        : null;

    if (intradayData && typeof intradayData === 'object') {
      sampleData['1d'] = Object.entries(intradayData)
        .slice(0, 120)
        .map(([timestamp, values]) => {
          const typedValues = values as Record<string, string>;
          const price = toFiniteNumber(typedValues['4. close']);
          const volume = toFiniteNumber(typedValues['5. volume']);

          return price === null || volume === null
            ? null
            : {
                date: timestamp,
                price,
                volume,
              };
        })
        .filter((point): point is { date: string; price: number; volume: number } => point !== null);
    }
  } catch (error) {
    console.error('Error fetching intraday stock data:', error instanceof Error ? error.message : 'Unknown error');
  }

  const daily = await yahooFinance.chart(symbol, {
    period1: '1900-01-01',
    interval: '1d',
  });

  const quotes = Array.isArray(daily.quotes) ? daily.quotes.slice(-MAX_CHART_POINTS) : [];
  const historicalData: PriceVolumeData = quotes
    .map((day) => {
      const date = day.date instanceof Date ? day.date : new Date(day.date);
      const price = toFiniteNumber(day.adjclose ?? day.close);
      const volume = toFiniteNumber(day.volume);

      return Number.isNaN(date.getTime()) || price === null || volume === null
        ? null
        : {
            date: date.toISOString().slice(0, 16),
            price,
            volume,
          };
    })
    .filter((point): point is { date: string; price: number; volume: number } => point !== null);

  const currentYear = String(new Date().getFullYear());

  sampleData['5d'] = historicalData.slice(-5);
  sampleData['1m'] = historicalData.slice(-31);
  sampleData['6m'] = historicalData.slice(-182);
  sampleData.ytd = historicalData.filter((day) => day.date.startsWith(currentYear));
  sampleData['1y'] = historicalData.slice(-365);
  sampleData['5y'] = historicalData.slice(-365 * 5);
  sampleData.max = historicalData;

  return sampleData;
}

export async function checkTickerValidity(ticker: string): Promise<boolean> {
  await requireSignedInUser();

  const symbol = normalizeTicker(ticker);
  const result = await yahooFinance.search(symbol, {
    quotesCount: 3,
    newsCount: 0,
  });

  const isValid = result.quotes?.some((quote) => {
    const quoteSymbol =
      quote && typeof quote === 'object' && 'symbol' in quote
        ? (quote as { symbol?: unknown }).symbol
        : null;

    return typeof quoteSymbol === 'string' && quoteSymbol.toUpperCase() === symbol;
  });
  if (!isValid) {
    throw new Error('Invalid ticker.');
  }

  return true;
}
