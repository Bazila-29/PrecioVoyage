const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const OpenAI = require('openai');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

app.use(cors());
app.use(express.json());

// Initialize AI (OpenRouter)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

// -----------------------------------------------------
// 1. Auth Routes
// -----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

app.delete('/api/user/delete', authenticateToken, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.user.userId } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/save-city', authenticateToken, async (req, res) => {
  const { cityId } = req.body;
  try {
    const existing = await prisma.savedCity.findUnique({
      where: { userId_cityId: { userId: req.user.userId, cityId } }
    });
    
    if (existing) {
      await prisma.savedCity.delete({ where: { id: existing.id } });
      res.json({ saved: false });
    } else {
      await prisma.savedCity.create({
        data: { userId: req.user.userId, cityId }
      });
      res.json({ saved: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user/saved-cities', authenticateToken, async (req, res) => {
  try {
    const saved = await prisma.savedCity.findMany({
      where: { userId: req.user.userId },
      include: { city: true }
    });
    res.json(saved.map(s => s.city));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------------------------------------------
// 2. Core Routes
// -----------------------------------------------------
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/city/:id', async (req, res) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { places: true }
    });
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/prices/:cityId', async (req, res) => {
  try {
    const prices = await prisma.priceItem.findMany({
      where: { cityId: req.params.cityId },
      include: { category: true }
    });
    const grouped = prices.reduce((acc, curr) => {
      const catName = curr.category.name;
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push({
        ...curr,
        min: curr.minPrice,
        max: curr.maxPrice,
        avg: curr.avgPrice
      });
      return acc;
    }, {});
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// -----------------------------------------------------
// 3. AI Routes (Gemini via OpenRouter)
// -----------------------------------------------------
app.post('/api/predict/image', upload.single('image'), async (req, res) => {
  if (!req.file || !process.env.OPENROUTER_API_KEY) return res.status(400).json({ error: 'Missing requirements' });
  const { cityId } = req.body;

  try {
    let cityContext = "";
    if (cityId) {
      const city = await prisma.city.findUnique({ where: { id: cityId } });
      const prices = await prisma.priceItem.findMany({ where: { cityId } });
      cityContext = `The user is in ${city.name}. Local references: ${prices.map(p => `${p.name}: ₹${p.minPrice}-₹${p.maxPrice}`).join(', ')}.`;
    }

    const base64Image = req.file.buffer.toString("base64");
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Identify this tourist item or souvenir in the context of Indian tourism. ${cityContext} Return ONLY a raw JSON object: {"item_name": "...", "min_price_inr": 100, "max_price_inr": 200, "prediction_confidence": 0.9}. No markdown.` },
            { type: "image_url", image_url: { url: `data:${req.file.mimetype};base64,${base64Image}` } }
          ]
        }
      ]
    });

    let text = response.choices[0].message.content;
    text = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    
    res.json({
      ...parsed,
      local_price_range: `₹${parsed.min_price_inr} - ₹${parsed.max_price_inr}`,
      tourist_price_estimate: `₹${Math.round(parsed.max_price_inr * 1.5)}`,
      fair_bargain_price: `₹${Math.round((parsed.min_price_inr + parsed.max_price_inr)/2 * 0.9)}`,
      is_mock: false
    });
  } catch (error) {
    console.error("AI Image failed:", error);
    res.status(500).json({ error: 'AI Prediction failed.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!process.env.OPENROUTER_API_KEY) return res.status(500).json({ error: 'AI not configured' });

  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "You are 'Travel Saathi', a savvy, helpful Indian travel assistant. Help tourists find fair prices and provide bargaining tips."
        },
        { role: "user", content: prompt }
      ]
    });
    res.json({ response: response.choices[0].message.content, is_mock: false });
  } catch (error) {
    console.error("AI Chat failed:", error);
    res.status(500).json({ error: 'Chat service unavailable.' });
  }
});

// -----------------------------------------------------
// 4. Calculations
// -----------------------------------------------------
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

app.post('/api/predict/intercity', async (req, res) => {
  const { fromCityId, toCityId, mode } = req.body;
  try {
    const from = await prisma.city.findUnique({ where: { id: fromCityId } });
    const to = await prisma.city.findUnique({ where: { id: toCityId } });
    if (!from || !to || !from.latitude || !to.latitude) return res.status(400).json({ error: 'Data missing' });

    const dist = getDistance(from.latitude, from.longitude, to.latitude, to.longitude);
    const rates = { Bus: 2.5, Train: 1.5, Cab: 15, Flight: 40 };
    res.json({ distanceKm: Math.round(dist), estimatedFare: Math.round(dist * (rates[mode] || 8)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
