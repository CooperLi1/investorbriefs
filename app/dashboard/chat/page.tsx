'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon, ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getStockInfo } from '@/app/api/summary';
import { superGPT, getSentiment } from '@/app/api/summary';
import checkTickerValidity from '@/app/api/visualize';
import { useEffect, useRef } from 'react';

const dataTypes = ["Overview", "News"];
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
  const [dataType, setType] = useState("Overview");
  const [loading, setLoading] = useState('Enter Data...');
  const [stockSummary, setSummary] = useState<StockSummary[]>([]);
  const [news, setNews] = useState([]);


  // Chatbot state
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // This effect runs every time messages change

  async function fetchOverview(ticker: string) {
    setLoading('Loading...');
    try {
      const overview = await getStockInfo(ticker);
      return overview ;
    } catch (error) {
      setLoading("Error fetching data:" + error);
    } finally {
      setLoading('Finished!');
    }
  }

  async function fetchNews(ticker: string) {
    setLoading('Loading...');
    try {
      const news = await getSentiment(ticker);
      return news ;
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
      setSearchHistory([...searchHistory, trimmedSearchTerm + `, ${dataType}`]);
        
        if(dataType == "News")
          var news = await fetchNews(trimmedSearchTerm);
          if (news) {
          setSummary(prev => {
            const updatedNews = [
              ...prev,
              news && news !== null ? news : {}
            ];
            return updatedNews;
          });
        }else{
          const overview = await fetchOverview(trimmedSearchTerm);
          if (overview) {
          setSummary(prev => {
            const updatedSummary = [
              ...prev,
              overview && overview !== null ? overview : {} as StockSummary
            ];

            return updatedSummary;
          });
        }
        }
        setSearchTerm('');
      }).catch(error => {
        setLoading('Invalid Ticker :(');
      });
    }
  };

  const removeTicker = (ticker: string) => {
    setSummary(prevSummary =>
      prevSummary.filter(stock => stock.symbol !== ticker)
    );
  };

  const removeNews = (word: string) => {
    setNews(prevNews =>
      prevNews.filter(article => 
        !Object.values(article).some(value =>
          typeof value === 'string' && value.includes(word)
        )
      )
    );
  };  

  const handleDelete = (term: string) => {
    setSearchHistory(searchHistory.filter(item => item !== term));
    if(term.includes('Overview')){
      removeTicker(term);
    }else if(term.includes('News')){
      removeNews(term);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Handle user input for chatbot
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    const answer = await superGPT(messages, stockSummary, userInput)
    if (userInput.trim()) {
      setMessages([
        ...messages,
        { type: 'user', content: userInput },
        { type: 'bot', content: [answer] },
      ]);
      setUserInput('');
    }
  };

  const handleAImsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
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
            placeholder="Provide real-time ticker data to BriefBot for improved insights..."
            className="inputfield"
          />
        </div>

        <div className="flex flex-col w-full sm:w-2/5 relative">
          <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <select value={dataType} onChange={(e) => setType(e.target.value)} className="inputfield">
            {dataTypes.map((range) => (<option key={range} value={range}>{range}</option>))}
          </select>
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
      </div>

      {/* Search Values */}
      <div className="w-full span mt-7 flex flex-wrap gap-2 items-start">
        {searchHistory.map((term, index) => (
          <div key={index} className="searchtag">
            {term}
            <button onClick={() => handleDelete(term)}>
              <XMarkIcon className="deleteicon" />
            </button>
          </div>
        ))}
      </div>

      {/* Results Section */}
      <div className="w-full mt-7">
      <div className="w-full h-[530px] textbox relative">
        {/* Chat Messages Area */}
        <div className="space-y-4 overflow-y-auto h-full pr-4 pb-20">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <p className={msg.type === 'user' ? 'text-blue-500' : 'text-green-500'}>
                {msg.content}
              </p>
            </div>
          ))}
          {/* This div will always be scrolled into view at the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area for New Message */}
        <div className="absolute w-96/100 bottom-0 span flex justify-center p-4">
          <PencilIcon className="absolute left-8 top-1/2 transform -translate-y-3 w-6 h-6 text-gray-500" />
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyDown={handleAImsg}
            placeholder="Ask me anything..."
            className="inputfield flex-1 pl-12"
          />
        </div>
      </div>
    </div>

    </div>
  );
}
