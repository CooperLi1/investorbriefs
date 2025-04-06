'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import visualData from '@/app/api/visualize';
import checkTickerValidity from '@/app/api/visualize';
import { Legend } from 'recharts';


const timeRanges = ["1d", "5d", "1m", "6m", "ytd", "1y", "5y", "max"];

type PriceVolumeData = { price: number; volume: number; date: string }[];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("1d");
  const [stockData, setStockData] = useState<Record<string, Record<string, PriceVolumeData>>>({});
  const [loading, setLoading] = useState('');

  async function fetchData(ticker: string) {
    setLoading('Loading...');
    try {
      return await visualData(ticker);
    } catch (error) {
      setLoading("Error fetching data:" + error);
    } finally {
      setLoading('Loaded!');
    }
  }

  const handleSearch = async () => {   

    if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim().toUpperCase())) {
      const trimmedSearchTerm = searchTerm.trim().toUpperCase();

      checkTickerValidity(trimmedSearchTerm).then(async valid => {  
        setSearchHistory([...searchHistory, trimmedSearchTerm]);

        const fetchedData = await fetchData(trimmedSearchTerm);
        if (fetchedData) {
          setStockData(prev => ({
            ...prev,
            [trimmedSearchTerm]: fetchedData
          }));
        }
        setSearchTerm('');
      }).catch(error => {
        setLoading('Invalid Ticker :(');
      });

    }

  };
  
  const removeTicker = (tickerToRemove: string) => {
    setStockData((prevData) => {
      const { [tickerToRemove]: _, ...rest } = prevData;
      return rest;
    });
  };
  
  const handleDelete = (term: string) => {
    setSearchHistory(searchHistory.filter(item => item !== term));
    removeTicker(term)
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
    
  type ChartEntry = {
    date: string;
    [ticker: string]: number | string;
  };
    
  const mergedData: Record<string, ChartEntry> = {};
  
  // Merge stock data per date per ticker
  Object.entries(stockData).forEach(([ticker, timeRanges]) => {
    const data = timeRanges[timeRange]; // e.g., 1d, 1m, etc.
    if (!data) return;
  
    data.forEach(({ date, price }) => {
      if (!mergedData[date]) {
        mergedData[date] = { date };
      }
      mergedData[date][ticker] = price;
    });
  });
  
  // Convert mergedData into a clean array for Recharts
  const selectedData: ChartEntry[] = Object.values(mergedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );  
  const getLineColor = (index: number) => {
    const colors = ['#8884d8', '#82ca9d', '#ff7300', '#413ea0', '#d0ed57']; // Example colors
    return colors[index % colors.length]; // Cycle through colors if more than the number of colors
  };
  
  const uniqueTicks = Array.from(new Set(selectedData.map((data) => data.date)));

  // Calculate the number of unique ticks
  const numberOfTicks = uniqueTicks.length;
    
    return (
    <div className="w-full px-4 pt-6 flex flex-col items-center">
      <div className='w-full flex sm:space-x-4'>
        {/* Search Bar */}
        <div className="w-full relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter tickers..."
            className="inputfield"
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/4 relative">
          <button onClick={handleSearch} className="submitbutton">Submit <ArrowRightIcon className="w-6 md:w-7" /></button>
          {loading == 'Invalid Ticker :(' ?
          <p className="absolute left-2 top-full mt-1 text-sm text-red-500 font-bold">
          {loading} 
          </p>
          :
          <p className="absolute left-2 top-full mt-1 text-sm text-green-500 font-bold">
          {loading} 
          </p>
          }
        </div>

        <div className="flex flex-col w-full sm:w-1/4 relative">
          <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="inputfield">
            {timeRanges.map((range) => (<option key={range} value={range}>{range.toUpperCase()}</option>))}
          </select>
        </div>
      </div>

      {/* Search Tags */}
      <div className="w-full mt-7 flex flex-wrap gap-2 items-start">
        {searchHistory.map((term, index) => (
          <div key={index} className="searchtag">
            {term}
            <button onClick={() => handleDelete(term)}>
              <XMarkIcon className="deleteicon" />
            </button>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="w-full h-[550px] textbox justify-center items-center mt-7"> {/* Increased height */}
      <ResponsiveContainer width="100%" height={500}>
          {Object.keys(stockData).length > 0 ? (
        <LineChart
          width={600}
          height={500}
          data={selectedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(tick) =>
              typeof tick === "string" ? (timeRange == '1d' ? tick.slice(11,16) : tick.slice(5, 10)) : tick
            }
            angle={-45}
            textAnchor="end"
            type="category"
          />

          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) =>
              typeof value === 'number' ? value.toFixed(2) : value
            }
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-800 text-white p-2 rounded shadow">
                    {
                      timeRange=='1d' ? (<p className="font-bold">Time: {label.slice(11,16)}</p>):(<p className="font-bold">Date: {label.slice(0, 10)}</p>)
                    }
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />

          {Object.keys(stockData).map((ticker, index) => (
            <Line
              key={ticker}
              type="monotone"
              dataKey={ticker}
              stroke={getLineColor(index)}
              activeDot={{ r: 6 }}
              name={ticker}
              dot={false}
              strokeWidth={2}
            />
          ))}

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 50 }}
          />
        </LineChart>
    ) : (
      <h2 className="text-3xl font-bold text-center mb-4">Enter Data...</h2>
    )}
  </ResponsiveContainer>

      </div>

    </div>
  );
}
