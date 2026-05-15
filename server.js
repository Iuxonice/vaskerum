const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'bookings.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Data helpers ──────────────────────────────────────────────────────────────

function load() {
  if (!fs.existsSync(DATA_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return {}; }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── API routes ────────────────────────────────────────────────────────────────

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(load());
});

// Add a booking
app.post('/api/bookings', (req, res) => {
  const { key, flat } = req.body;
  if (!key || !flat) return res.status(400).json({ error: 'Missing key or flat' });

  const bookings = load();
  if (bookings[key]) return res.status(409).json({ error: 'Slot already taken' });

  bookings[key] = { flat: flat.trim(), at: new Date().toISOString() };
  save(bookings);
  res.json({ ok: true });
});

// Delete a booking (only the same flat can delete)
app.delete('/api/bookings/:key', (req, res) => {
  const key = decodeURIComponent(req.params.key);
  const { flat } = req.body;

  const bookings = load();
  if (!bookings[key]) return res.status(404).json({ error: 'Not found' });
  if (bookings[key].flat !== flat) return res.status(403).json({ error: 'Not your booking' });

  delete bookings[key];
  save(bookings);
  res.json({ ok: true });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vaskerum kører på http://localhost:${PORT}`);
});
