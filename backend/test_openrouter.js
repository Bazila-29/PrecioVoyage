const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

async function test() {
  const models = [
    "google/gemini-flash-1.5",
    "google/gemini-1.5-flash",
    "google/gemini-pro-1.5",
    "google/gemini-flash-1.5-8b",
    "openai/gpt-3.5-turbo"
  ];

  for (const m of models) {
    try {
      const response = await openai.chat.completions.create({
        model: m,
        messages: [{ role: "user", content: "test" }]
      });
      console.log(`${m} works!`);
    } catch (e) {
      console.error(`${m} failed:`, e.message);
    }
  }
}

test();
