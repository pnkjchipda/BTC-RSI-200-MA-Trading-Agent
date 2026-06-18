/**
 * Crypto Risk Guardian AI — Static File Server
 *
 * Serves the trading agent dashboard on port 3000.
 * Usage: node server.js
 *
 * For production, deploy behind a reverse proxy (nginx, Caddy)
 * or use a platform like Vercel, Netlify, or Railway.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Crypto Risk Guardian AI',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Fallback: serve index.html for all other routes (SPA-friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Crypto Risk Guardian AI`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
  console.log(`\n  Press Ctrl+C to stop.\n`);
});
