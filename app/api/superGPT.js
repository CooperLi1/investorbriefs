import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

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
export async function superGPT(pastConvo, data, question) {
  console.time("getBrief Execution Time");

  const prompt = "hi"

  console.time("GPT Response Time");

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
