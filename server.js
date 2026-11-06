const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = 'https://api.gameskinbo.com';
const API_KEY = process.env.GAMES_KINBO_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Axios instance with default header
const kinboClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

// Helper for handling API errors cleanly
const handleApiError = (res, error) => {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  }
  return res.status(500).json({ error: 'Internal Server Error', message: error.message });
};

// 1. Get Player Information Route
// Example: GET /player-info?uid=2312730961&region=BD
app.get('/player-info', async (req, res) => {
  try {
    const { uid, region } = req.query;

    if (!uid) {
      return res.status(400).json({ error: 'Player UID is required.' });
    }

    const params = { uid };
    if (region) {
      params.region = region;
    }

    const response = await kinboClient.get('/ff-info/get', { params });
    return res.status(200).json(response.data);
  } catch (error) {
    return handleApiError(res, error);
  }
});

// 2. Check API Usage Route
// Example: GET /usage
app.get('/usage', async (req, res) => {
  try {
    const response = await kinboClient.get('/api/usage');
    return res.status(200).json(response.data);
  } catch (error) {
    return handleApiError(res, error);
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send({ message: 'Free Fire Info Proxy Server is Running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
