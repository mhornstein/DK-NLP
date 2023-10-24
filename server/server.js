const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware for request validation
function validateTagSentenceRequest(req, res, next) {
  const { mode, sentence } = req.query;

  if (!mode || (mode !== 'ner' && mode !== 'pos') || !sentence) {
    res.status(400).json({ error: 'Invalid mode or sentence parameters. Mode must be "ner" or "pos". Sentence is required.' });
  } else {
    next();
  }
}

// Routes
app.get('/tag', validateTagSentenceRequest, async (req, res) => {
  const { mode, sentence } = req.query;
  try {
    const response = await axios.get(`http://127.0.0.1:4000/tag?mode=${mode}&sentence=${encodeURIComponent(sentence)}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error in tagging service.', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
