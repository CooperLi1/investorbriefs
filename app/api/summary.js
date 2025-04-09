"use server";
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import yahooFinance from 'yahoo-finance2';

const newsapikey = process.env.NEWS_API_KEY;
const alphavantagekey = process.env.ALPHAVANTAGE_API_KEY;
const sortBy = ["popularity", "relevancy", "publishedAt"];

// Get Sentiment (News Articles)
export async function getSentiment(query, numArticles = 5) {
  try {
    console.time(`News API (${query})`); // Start timing

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: 'relevancy',
        pageSize: numArticles,
        language: "en", // Reduce unnecessary results
        apiKey: newsapikey,
      },
    });

    console.timeEnd(`News API (${query})`); // End timing

    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      throw new Error('No articles found or API limit reached.');
    }

    // Extract relevant fields
    const cleanedData = articles.map(article => ({
      source: article.source?.name || 'Unknown',
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
    }));

    return cleanedData;
  } catch (error) {
    console.error('Error fetching sentiment:', error.message);
    return null;
  }
}

// Get Stock Information
// async function getStockInfo(ticker) {
//   try {
//     console.time(`Stock API (${ticker})`); // Start timing

//     const response = await axios.get('https://www.alphavantage.co/query', {
//       params: {
//         function: 'OVERVIEW',
//         symbol: ticker,
//         apikey: alphavantagekey,
//       },
//     });

//     console.timeEnd(`Stock API (${ticker})`); // End timing

//     const data = response.data;

//     if (!data || Object.keys(data).length === 0) {
//       throw new Error('Invalid ticker or API limit reached.');
//     }

//     // Extract relevant fields
//     const cleanedData = {
//       name: data.Name,
//       symbol: data.Symbol,
//       sector: data.Sector,
//       industry: data.Industry,
//       marketCap: data.MarketCapitalization,
//       peRatio: data.PERatio,
//       dividendYield: data.DividendYield,
//       profitMargin: data.ProfitMargin,
//       returnOnEquity: data.ReturnOnEquityTTM,
//       description: data.Description,
//     };

//     return cleanedData;
//   } catch (error) {
//     console.error('Error fetching stock overview:', error.message);
//     return null;
//   }
// }
export async function getStockInfo(ticker) {
  try {
    console.time(`Stock API (${ticker})`);

    const quoteSummary = await yahooFinance.quoteSummary(ticker, {
      modules: ['assetProfile', 'summaryDetail', 'price', 'defaultKeyStatistics', 'financialData'],
    });

    console.timeEnd(`Stock API (${ticker})`);

    const {
      price,
      assetProfile,
      summaryDetail,
      defaultKeyStatistics,
      financialData,
    } = quoteSummary;

    const cleanedData = {
      name: price?.longName || '',
      symbol: price?.symbol || '',
      sector: assetProfile?.sector || '',
      industry: assetProfile?.industry || '',
      // Try price.marketCap first, then defaultKeyStatistics.marketCap
      marketCap:
        price?.marketCap?.toString() ||
        defaultKeyStatistics?.marketCap?.toString() ||
        'N/A',
      peRatio: summaryDetail?.trailingPE || 0,
      dividendYield: summaryDetail?.dividendYield || 0,
      profitMargin: financialData?.profitMargins || 0,
      returnOnEquity: financialData?.returnOnEquity || 0,
      description: assetProfile?.longBusinessSummary || '',
    };

    return cleanedData;
  } catch (error) {
    console.error('Error fetching stock overview:', error.message);
    return null;
  }
}

// GPT Chat Function
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY,
});

async function chatGPT(prompt) {
  try {
    console.time("GPT Response Time"); // Start timing GPT request

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    
    console.timeEnd("GPT Response Time"); // End timing GPT request
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in GPT request:", error);
    throw error;
  }
}

export async function getBrief(ticker, guidelines) {
  console.time("getBrief Execution Time");

  // Fetch news and stock info in parallel
  const newsPromise = getSentiment(ticker, 10);
  const stockPromise = getStockInfo(ticker);

  // Wait for both API responses
  const [newsArticles, stockInfo] = await Promise.all([newsPromise, stockPromise]);

  if (!newsArticles || !stockInfo || Object.keys(stockInfo).length === 0) {
    return "It looks like something went wrong. Check the ticker? The API might have returned an error or no data.";
  }

  // Keep the same detailed prompt
  const prompt = `Summarize the following stock news and financial data in a **concise, readable format** and explain how it should impact a user's investment strategy. Make sure to include links for any sources.

---

### **News Analysis: How Does This Impact the Stock?**  
For each news article below, explain **how it influences investor sentiment and potential risks.**  
Consider factors like valuation, industry trends, and stock movements.

**News Articles:**  
${newsArticles.map(a => `- **${a.title}**\n  ${a.description}\n  [Read more](${a.url})`).join("\n\n")}

---

### **Stock Financial Overview:**
  - Name: ${stockInfo.name} (${stockInfo.symbol})  
  - Industry: ${stockInfo.industry}, Sector: ${stockInfo.sector}  
  - Market Cap: ${stockInfo.marketCap}, PE Ratio: ${stockInfo.peRatio}  
  - Dividend Yield: ${stockInfo.dividendYield}, Profit Margin: ${stockInfo.profitMargin}  
  - Return on Equity: ${stockInfo.returnOnEquity}  
---

### **Investment Ratings & Strategy**
- **Valuation Check:** Based on the news sentiment and stock ratios, is this stock overvalued, undervalued, or fairly priced?  
- **Market Sentiment Shift:** How is investor confidence changing based on the news?  
- **Sector Trends:** Does the stock’s sector show signs of growth or weakness?  
- **Strategic Move:** Should investors buy, sell, hold, or wait for better entry points?  

---
### **Guidelines**
- Make absolutely sure you follow the users guidelines for the summary here: **${guidelines}** and adjust the **tone, information, formatting, and complexity accordingly** 

---

### **Example Analysis (Adjust Based on Guidelines)**

### **Stock Summary: NVIDIA Corporation (NVDA)**  

**Company Overview**  
- **Industry:** Semiconductors & Related Devices  
- **Market Cap:** $2.82 trillion  
- **PE Ratio:** 39.26  
- **Dividend Yield:** 0.03%  
- **Profit Margin:** 55.8%  
- **Return on Equity:** 119.2%  

**Recent News Highlights**  
1. **Valuation Debate:** Analysts are split on whether NVIDIA is overvalued, with some arguing its growth justifies its high PE ratio, while others warn of a potential bubble. [Read more](https://example.com)  
2. **Technical Weakness:** NVIDIA shares recently fell below their 200-day moving average, signaling a potential bearish trend. [Read more](https://example.com)  
3. **AI Sector Volatility:** The AI market is experiencing turbulence, impacting NVIDIA’s short-term growth outlook. [Read more](https://example.com)  

### **Investment Ratings**  
- **Valuation Concerns:** NVIDIA’s PE ratio of 39.26 is high, making it vulnerable if future earnings do not meet expectations.  
- **Technical Pressure:** The recent price decline suggests short-term caution.  
- **Sector Risk:** The semiconductor and AI sectors are under pressure, increasing uncertainty.  

### **Investment Strategy Recommendation**  
**Rating:** 6/10  

**Strategy:**  
1. **Caution on Current Holdings:** If holding NVIDIA, monitor technical signals for further weakness.  
2. **Diversification:** Consider alternative AI and semiconductor stocks to reduce risk exposure.  
3. **Buying Opportunities:** Watch for price stabilization before considering new positions.  

Investors should balance NVIDIA’s strong fundamentals against sector volatility and recent technical trends.  

**the example summary ends here, dont include this**
---

### **Final Verdict:**  
Ensure your summary is **structured, insightful, and integrates news articles** into the investment recommendation.  
Again follow these guidelines: **${guidelines}** and adjust the **tone, information, formatting, and complexity accordingly**.  
`;

  console.time("GPT Response Time");

  // Stream GPT response
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // Use "gpt-3.5-turbo" for lower cost if needed
    messages: [{ role: "user", content: prompt }],
    stream: true, // Enables streaming
  });

  console.timeEnd("GPT Response Time");
  console.timeEnd("getBrief Execution Time");

  let fullResponse = "";
  for await (const chunk of stream) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  return fullResponse; // Ensure this is a string
}

export async function compareGPT(names, guidelines, overviews){
  const prompt = `compare the following stocks: ${names} using the following data: ${overviews}. 
  When doing so, make sure to follow the users guidelines for how to compare the stocks: ${guidelines}. 
  If they don't have any, compare in the style you think makes the most sense.
  Address positives and negatives of investing in each of the stocks and which stocks you think are the best to invest in.
  Use a **concise, readable format with multiple headers and sections** and explain how it should impact a user's investment strategy.
  `
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // Use "gpt-3.5-turbo" for lower cost if needed
    messages: [{ role: "user", content: prompt }],
    stream: true, // Enables streaming
  });

  let fullResponse = "";
  for await (const chunk of stream) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  return fullResponse; // Ensure this is a string
}
export async function superGPT(pastConvo, data, question) {
  const prompt = 
  `You are an investment advisor chatbot. 
  Your job is to synthesize information from your knowledge base,
  the conversation so far and data provided to you to answer questions.
  First, this has been the conversation so far. Make sure to keep it in mind: ${pastConvo}.
  Second, this is the data you have been given: ${data}
  Finally, this is the question you have been asked :${question}
  Answer it as best you can, and keep it simple and straight to the point. Don't hallucinate, be kind.
  `

  console.time("GPT Response Time");

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // Use "gpt-3.5-turbo" for lower cost if needed
    messages: [{ role: "user", content: prompt }],
    stream: true, // Enables streaming
  });

  let fullResponse = "";
  for await (const chunk of stream) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  return fullResponse; 
}
