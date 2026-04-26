const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

async function test() {
  const models = [
    "google/gemini-flash-1.5:free",
    "google/gemini-pro-1.5:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemini-pro"
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
