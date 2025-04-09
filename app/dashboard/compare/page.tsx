'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon, ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import visualData from '@/app/api/visualize';
import {getStockInfo} from '@/app/api/summary'
import {compareGPT} from '@/app/api/summary'
import checkTickerValidity from '@/app/api/visualize';
import { Legend } from 'recharts';
import CustomMarkdown from '@/app/components/markdown'


const timeRanges = ["1d", "5d", "1m", "6m", "ytd", "1y", "5y", "max"];

type PriceVolumeData = { price: number; volume: number; date: string }[];

interface StockSummary {
  name: string;
  symbol: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  profitMargin: number;
  returnOnEquity: number;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("1d");
  const [stockData, setStockData] = useState<Record<string, Record<string, PriceVolumeData>>>({});
  const [stockSummary, setSummary] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState('');
  const [description, setDescription] = useState("");
  const [resultsAI, setAIResults] = useState("Enter guidelines...");


  async function fetchData(ticker: string) {
    setLoading('Loading...');
    try {
      const visdata = await visualData(ticker);
      const overview = await getStockInfo(ticker)
      return {visdata, overview};
    } catch (error) {
      setLoading("Error fetching data:" + error);
    } finally {
      setLoading('Finished!');
    }
  }

  const handleSearch = async () => {   

    if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim().toUpperCase())) {
      const trimmedSearchTerm = searchTerm.trim().toUpperCase();

      checkTickerValidity(trimmedSearchTerm).then(async valid => {  
        setSearchHistory([...searchHistory, trimmedSearchTerm]);

        const data = await fetchData(trimmedSearchTerm);
        if(data){
          const visdata = data.visdata
          setStockData(prev => ({
            ...prev,
            [trimmedSearchTerm]: visdata
          }));

          const overview = data.overview
          setSummary(prev => {
            const updatedSummary = [
              ...prev, 
              overview && overview !== null ? overview : {} as StockSummary
            ];
          
            return updatedSummary;
          });
          }
        setSearchTerm('');
      }).catch(error => {
        setLoading('Invalid Ticker :(');
      });

    }

  };
  
  const removeTicker = (ticker: string) => {
    setStockData((prevData) => {
      const { [ticker]: _, ...rest } = prevData;
      return rest;
    });
    setSummary(prevSummary => 
      prevSummary.filter(stock => stock.symbol !== ticker)
    );  
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

  const handleKeyDownAI = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmitAI();
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmitAI = async () => {
    setAIResults("Loading...");
    setDescription("");

    try {
      const result = await compareGPT(searchHistory, description, stockSummary);
      setAIResults(result !== null ? result : "Something went wrong :(");
    } catch (error) {
      console.error("Error fetching comparison:", error);
      setAIResults("Error fetching comparison:" + error);
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

      <hr className='w-full divider border-t-4 mt-7'/>

      <div className="w-full textbox justify-center items-center mt-7">
      <table className="min-w-full table-auto text-gray-900 dark:text-white border-collapse">
          <thead className="">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Symbol</th>
              <th className="border px-4 py-2 text-left">Sector</th>
              <th className="border px-4 py-2 text-left">Industry</th>
              <th className="border px-4 py-2 text-left">Market Cap</th>
              <th className="border px-4 py-2 text-left">P/E Ratio</th>
              <th className="border px-4 py-2 text-left">Dividend Yield</th>
              <th className="border px-4 py-2 text-left">Profit Margin</th>
              <th className="border px-4 py-2 text-left">Return on Equity</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {Object.values(stockSummary).map((stock, index) => (
              <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <td className="border px-4 py-2">{stock.name}</td>
                <td className="border px-4 py-2">{stock.symbol}</td>
                <td className="border px-4 py-2">{stock.sector}</td>
                <td className="border px-4 py-2">{stock.industry}</td>
                <td className="border px-4 py-2">{stock.marketCap}</td>
                <td className="border px-4 py-2">{stock.peRatio}</td>
                <td className="border px-4 py-2">{stock.dividendYield}</td>
                <td className="border px-4 py-2">{stock.profitMargin}</td>
                <td className="border px-4 py-2">{stock.returnOnEquity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <hr className='w-full divider border-t-4 mt-7'/>
      
      {/* AI search */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-7">
        
        {/* Description */}
        <div className="flex flex-col w-full sm:w-3/4 relative">
          <PencilIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="inputfield"
            placeholder="Give instructions for AI comparison (focus on data, keep it simple, etc)..."
            onKeyDown={handleKeyDownAI}
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col w-full sm:w-1/4 relative">
          <button 
            onClick={handleSubmitAI}
            className="submitbutton"
          >
            Submit
            <ArrowRightIcon className="w-6 md:w-7" />
          </button>
        </div>
        
      </div>
      
      <div className="w-full mt-7">
        <div className="w-full h-[600px] sm:h-[600px] textbox">
          <CustomMarkdown content={resultsAI}/>
        </div>
      </div>

      <div className ='mt-14'></div>
    </div>
  );
}
