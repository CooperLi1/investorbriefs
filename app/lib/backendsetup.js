// Sentiment Analysis
const newsapikey = process.env.NEWS_API_KEY;
const sortBy = ["popularity", "relevancy", "publishedAt"];

async function getSentiment(text, numArticles) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(text)}&sortBy=${sortBy[2]}&language=en&pageSize=${numArticles}&apiKey=${newsapikey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching sentiment:', error);
        return null;
    }    
}

/// Stock Info
const alphavantagekey = process.env.ALPHAVANTAGE_API_KEY;

async function getStockInfo(symbol) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${alphavantagekey}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching stock info for ${symbol}: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the data contains the necessary information
    if (!data || !data.Symbol) {
      throw new Error('Invalid or empty data returned from Alpha Vantage.');
    }

    return data;
  } catch (error) {
    console.error('Error fetching stock info:', error.message);
    return null; // Return null or an appropriate default value
  }
}

// GPT
const gptApiKey = process.env.GPT_API_KEY;
const gptApiUrl = 'https://api.openai.com/v1/chat/completions';

async function chatWithGPT(message) {
  const response = await fetch(gptApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${gptApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export function getBrief(ticker, guidelines){
    const prompt = `Given the following news articles: ${getSentiment(ticker, 10)} and the following financial information: ${getStockInfo(ticker)} give a summary of the stock and a rating out of 10 for investment potential. Have it follow these guidelines: ${guidelines}. If you get no news articles or financial information, return that something went wrong and the ticker was probably incorrect.`;
    return chatWithGPT(prompt);
}