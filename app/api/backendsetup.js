"use server";
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const newsapikey = process.env.NEWS_API_KEY;
const sortBy = ["popularity", "relevancy", "publishedAt"];

async function getSentiment(text, numArticles) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: text,
        sortBy: sortBy[2],
        pageSize: numArticles,
        apiKey: newsapikey
      }
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sentiment:", error);
  }
}

/// Stock Info
const alphavantagekey = process.env.ALPHAVANTAGE_API_KEY;

async function getStockInfo(ticker) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'OVERVIEW',
        symbol: ticker,
        apikey: alphavantagekey
      }
    });

    if (response.data && Object.keys(response.data).length > 0) {
      return response.data; 
      console.log(response.data)
    } else {
      throw new Error('Invalid ticker or API limit reached.');
    }
  } catch (error) {
    console.error("Error fetching stock overview:", error);
    return null;
  }
}
// GPT
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY
});

async function chatGPT(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getBrief(ticker, guidelines) {
  try {
    const [newsArticles, stockInfo] = await Promise.all([
      getSentiment(ticker, 10),
      getStockInfo(ticker)
    ]);

    if (!newsArticles || !stockInfo || Object.keys(stockInfo).length === 0) {
      return "It looks like something went wrong, check the ticker? The API might have returned an error or no data.";
    }

    const prompt = `Given the following news articles: ${JSON.stringify(newsArticles)} 
    and the following financial information: ${JSON.stringify(stockInfo)}, 
    give a summary of the stock and a rating out of 10 for investment potential. 
    Have it follow these guidelines: ${guidelines}. Make it very readable and use both the news and stock info heavily, link the news articles.`;

    const response = await chatGPT(prompt);
    return response;

  } catch (error) {
    console.error("Error in getBrief:", error);
    return `It looks like something went wrong, check the ticker? Error details: ${error.message}`;
  }
}