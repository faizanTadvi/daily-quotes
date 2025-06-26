const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const quotes = [
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
  "The secret of getting ahead is getting started. – Mark Twain",
  "Believe you can and you’re halfway there. – Theodore Roosevelt"
];

let currentQuoteIndex = 0;

// Cron job: runs every day at 10:00 AM server time
cron.schedule('0 10 * * *', () => {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  console.log('Quote updated:', quotes[currentQuoteIndex]);
});

// Serve the current quote
app.get('/api/quote', (req, res) => {
  res.json({ quote: quotes[currentQuoteIndex] });
});

// On server start, set quote based on days since a fixed date
function setInitialQuote() {
  const now = new Date();
  const base = new Date(2024, 0, 1);
  const diffDays = Math.floor((now - base) / (1000 * 60 * 60 * 24));
  currentQuoteIndex = diffDays % quotes.length;
}
setInitialQuote();

// Serve static files from "zenmode-audio" directory
app.use('/zenmode-audio', express.static(path.join(__dirname, 'zenmode-audio')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});