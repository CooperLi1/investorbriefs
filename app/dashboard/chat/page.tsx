'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import visualData from '@/app/api/visualize';

const dataTypes = ["Overview", "News", "DataOverTime"];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [dataType, setType] = useState("Overview")
  const [errors, setErrors] = useState({ timeRange: false });
  const [loading, setLoading] = useState('Enter Data...');

  
  async function fetchData(ticker: string) {
    setLoading('Loading...');
    try {
      return await visualData(ticker);
    } catch (error) {
      setLoading("Error fetching data:" + error);
    } finally {
      setLoading('done');
    }
  }

  const handleSearch = async () => {
    if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
      const trimmedSearchTerm = searchTerm.trim().toUpperCase() + ', ' + dataType;
      setSearchHistory([...searchHistory, trimmedSearchTerm]);
      setSearchTerm('');
    }
  };

  const handleDelete = (term: string) => {
    setSearchHistory(searchHistory.filter(item => item !== term));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <div className="w-full px-4 pt-6 flex flex-col items-center">
      <div className='w-full flex sm:space-x-4'>
        {/* Search Bar */}
        <div className="w-full span relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Feed BriefBot real-time data on this ticker..."
            className="inputfield"
          />
        </div>

        <div className="flex flex-col w-full sm:w-2/5 relative">
          <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <select value={dataType} onChange={(e) => setType(e.target.value)} className="inputfield">
            {dataTypes.map((range) => (<option key={range} value={range}>{range}</option>))}
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-1/4">
          <button onClick={handleSearch} className="submitbutton">Submit <ArrowRightIcon className="w-6 md:w-7" /></button>
        </div>
      </div>

      {/* Search Values */}
      <div className="w-full span mt-4 flex flex-wrap gap-2 items-start">
        {searchHistory.map((term, index) => (
          <div key={index} className="searchtag">
            {term}
            <button onClick={() => handleDelete(term)}>
              <XMarkIcon className="deleteicon" />
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
}
