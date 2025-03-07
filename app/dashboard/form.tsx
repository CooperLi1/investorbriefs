'use client'

import { useState } from 'react'
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { getBrief } from '@/pages/api/backendsetup'
import ReactMarkdown from 'react-markdown';

export function Form() {
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState("Briefs show up here! Search Something!");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("Form submitted with:", {
      ticker,
      description,
    });

    // Set loading state to true while waiting for the response
    setIsLoading(true);
    setResults("Loading..."); // Show loading message

    // Reset input fields
    setTicker("");
    setDescription("");

    try {
      const result = await getBrief(ticker, description); // Wait for the promise to resolve
      if (result !== null) {
        setResults(result); 
      } else {
        setResults("Something went wrong :("); 
      }
    } catch (error) {
      console.error("Error fetching brief:", error);
      setResults("Error fetching brief:" + error);
    } finally {
      setIsLoading(false); // Stop loading after the request is done
    }
  };

  return (
    <div className="w-full max-w-6xl h-[600px] p-6 sm:p-16 bg-gradient-to-b from-sky-400 to-blue-500 border-8 border-sky-200 rounded-2xl overflow-hidden shadow-lg relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 w-full">

        {/* Ticker */}
        <div className="flex flex-col w-full sm:w-1/3">
          <input 
            type="text" 
            id="ticker" 
            value={ticker} 
            onChange={handleTickerChange} 
            className="mt-2 p-4 text-xl border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:scale-105 hover:shadow-2xl hover:border-white hover:bg-blue-600"
            placeholder="Enter ticker..." 
          />
        </div>

        {/* Description */}
        <div className="flex flex-col w-full sm:w-2/3">
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-2 p-4 text-lg border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:scale-105 hover:shadow-2xl hover:border-white hover:bg-blue-600"
            placeholder="Enter brief guidelines (ex. simple)..."
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col w-full sm:w-1/4">
          <button 
            onClick={handleSubmit}
            className="mt-2 p-4 text-xl border-2 border-sky-200 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 w-full shadow-md hover:scale-105 hover:shadow-2xl hover:border-white hover:bg-blue-600"
          >
            Submit
            <ArrowRightIcon className="w-5 md:w-6 ml-2" /> {/* Added margin-left to space the icon */}
          </button>
        </div>

      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="w-full h-[350px] sm:h-[350px] p-4 text-xl border-2 border-sky-200 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white resize-none overflow-y-auto">
          <ReactMarkdown>{results}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
