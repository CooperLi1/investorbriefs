'use client'

import { useState, useEffect } from 'react'
import { ArrowRightIcon, MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getBrief } from '@/app/api/backendsetup'
import ReactMarkdown from 'react-markdown';
import CustomMarkdown from '@/app/components/markdown'

export default function Form() {
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState("Try searching something!");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("Form submitted with:", { ticker, description });

    setIsLoading(true);
    setResults("Loading...");

    setTicker("");
    setDescription("");

    try {
      const result = await getBrief(ticker, description);
      // {console.log(results)}
      setResults(result !== null ? result : "Something went wrong :(");
    } catch (error) {
      console.error("Error fetching brief:", error);
      setResults("Error fetching brief:" + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key)
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
    
  return (
    
    <div className="w-full px-4 pt-0">
      {/* Search Bar */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-0">
        
        {/* Ticker */}
        <div className="flex flex-col w-full sm:w-1/4 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input 
            type="text" 
            id="ticker" 
            value={ticker} 
            onChange={handleTickerChange} 
            className="inputfield"
            placeholder="Enter ticker..." 
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col w-full sm:w-2/4 relative">
          <PencilIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="inputfield"
            placeholder="Give instructions for summary..."
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col w-full sm:w-1/4">
          <button 
            onClick={handleSubmit}
            className="submitbutton"
          >
            Submit
            <ArrowRightIcon className="w-6 md:w-7" />
          </button>
        </div>
        
      </div>

      {/* Results Section */}
      <div className="w-full mt-6">
        <div className="w-full h-[600px] sm:h-[600px] textbox">
          <CustomMarkdown content={results}/>
        </div>
      </div>
      
    </div>
  );
}