const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.0-pro"
  ];

  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("test");
      console.log(`${m} works!`);
      return; // Stop if one works
    } catch (e) {
      console.error(`${m} failed:`, e.message);
    }
  }
}

list();
