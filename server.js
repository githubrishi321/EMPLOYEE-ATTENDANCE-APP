/**
 * Minimal Express backend for API routes, MongoDB connection, and CORS.
 * Production-ready defaults: listens on PORT (default 8080) and expects
 * environment variables to be provided by your host (e.g., Elastic Beanstalk).
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : '*';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

// --- Middleware ---
app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '2mb' }));

// --- Database Connection ---
mongoose
  .connect(MONGODB_URI, {
    autoIndex: false,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// --- Example API Routes ---
const api = express.Router();

// Health check (useful for load balancers)
api.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Example resource route
api.get('/example', async (req, res) => {
  try {
    // Replace with real logic or DB query
    res.json({ message: 'Example endpoint is working' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/api', api);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

