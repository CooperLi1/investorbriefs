'use client'

import { useState } from 'react';
import { ArrowRightIcon, MagnifyingGlassIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from 'recharts';
import visualData from '@/app/api/visualize'

type PriceVolumeData = { price: number; volume: number }[];

var sampleData: Record<string, PriceVolumeData> = {
  "1d": [],
  "5d": [],
  "1m": [],
  "6m": [],
  "ytd": [],
  "1y": [],
  "5y": [],
  "max": [],
};

const chartTypes = {
  line: "Line Chart",
  bar: "Bar Chart (Volume)",
  area: "Area Chart",
};

const timeRanges = ["1d", "5d", "1m", "6m", "ytd", "1y", "5y", "max"];

export default function StockPage() {
  const [ticker, setTicker] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartType, setChartType] = useState("");
  const [timeRange, setTimeRange] = useState("max");
  const [errors, setErrors] = useState({ chartType: false, timeRange: false });
  const [loading, setLoading] = useState('Enter Data...')

  async function fetchData() {
    setLoading('Loading...')
    try{
      sampleData = await visualData(ticker);
    }catch(error){
      setLoading("Error fetching data:" + error)
    }finally{
      setLoading('done')
    }
  }

  const handleSubmit = async() => {
      if(chartType != null){
      let newErrors = { chartType: false, timeRange: false };

      if (!chartType) newErrors.chartType = true;
      if (!timeRange) newErrors.timeRange = true;

      setErrors(newErrors);

      if (!newErrors.chartType && !newErrors.timeRange) {
        if (ticker) {
          setSelectedStock(ticker.toUpperCase());
        }
      }
      fetchData()
    }
  };

  const stockData = sampleData[timeRange as keyof typeof sampleData];

  return (
    <div className="w-full px-4 pt-0">
      {/* UI Controls */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-0">
        <div className="flex flex-col w-full sm:w-1/4 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} className="inputfield" placeholder="Enter ticker..." />
        </div>
        <div className="flex flex-col w-full sm:w-1/4">
          <button onClick={handleSubmit} className="submitbutton">Submit <ArrowRightIcon className="w-6 md:w-7" /></button>
        </div>
        <div className="flex flex-col w-full sm:w-1/4 relative">
          <ChartBarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="inputfield">
            <option value="">Select Chart Type</option>
            {Object.entries(chartTypes).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
          </select>
          {errors.chartType && (<p className="absolute left-2 top-full mt-1 text-sm text-red-500">Please select a chart type</p>)}
        </div>
        <div className="flex flex-col w-full sm:w-1/4 relative">
          <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="inputfield">
            {timeRanges.map((range) => (<option key={range} value={range}>{range.toUpperCase()}</option>))}
          </select>
          {errors.timeRange && (<p className="absolute left-2 top-full mt-1 text-sm text-red-500">Please select a time range</p>)}
        </div>
      </div>
      {/* Chart Display */}
  <div className="w-full flex justify-center mt-6">
    <div className="w-full h-[600px] textbox"> {/* Increased height */}
      <h2 className="text-3xl font-bold text-center mb-4">
        {loading=='done' ? (Object.values(sampleData).every((arr: PriceVolumeData) => arr.length === 0) ? 'Something Went Wrong' : (selectedStock + ' ' + timeRange.toUpperCase())) : loading}
      </h2>
      <div className="h-[480px] flex justify-center items-center"> {/* Centered */}
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(tick) => timeRange === "1d" ? tick.slice(11, 16) : tick.slice(5)} 
                tickCount={30}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                tickFormatter={(value) => Number(value).toFixed(1)}
              />
              <Tooltip formatter={(value) => Number(value).toFixed(1)} />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <XAxis dataKey="date" 
              tickFormatter={(tick) => timeRange === "1d" ? tick.slice(11, 16) : tick.slice(5)} 
              tickCount={30}
              />
              <YAxis 
                domain={[0, 'auto']} 
                tickFormatter={(value) => Number(value).toFixed(1)}
              />
              <Tooltip formatter={(value) => Number(value).toFixed(1)} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="volume" fill="#82ca9d" barSize={30} />
            </BarChart>
          ) : chartType === "area" ? (
            <AreaChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <XAxis dataKey="date" 
              tickFormatter={(tick) => timeRange === "1d" ? tick.slice(11, 16) : tick.slice(5)}      
              tickCount={30}/>
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                tickFormatter={(value) => Number(value).toFixed(1)} 
              />
              <Tooltip formatter={(value) => Number(value).toFixed(1)} />
              <CartesianGrid strokeDasharray="3 3" />
              <Area dataKey="price" fill="#8884d8" stroke="#8884d8" strokeWidth={2} />
            </AreaChart>
          ) : (
            <div />
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
    </div>
  );
}

