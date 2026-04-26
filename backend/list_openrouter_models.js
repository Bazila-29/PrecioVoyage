require('dotenv').config();

async function list() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    const data = await res.json();
    const geminiModels = data.data.filter(m => m.id.includes('gemini'));
    console.log("Available Gemini Models on OpenRouter:");
    geminiModels.forEach(m => console.log(m.id));
  } catch (e) {
    console.error("Failed to list models:", e.message);
  }
}

list();
