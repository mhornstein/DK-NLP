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

function validateFetchEntriesRequest(req, res, next) {
  const { entry_id, num_entries, mode } = req.query;

  if (!mode || (mode !== 'ner' && mode !== 'pos')) {
    res.status(400).json({ error: 'Invalid mode parameter. It is mandatory and must be "ner" or "pos".' });
  } else if (num_entries && !Number.isInteger(Number(num_entries))) {
    res.status(400).json({ error: 'Invalid num_entries parameter. It must be an integer.' });
  } else if (num_entries && Number.isInteger(Number(num_entries)) && Number(num_entries) <= 0) {
    res.status(400).json({ error: 'Invalid num_entries parameter. It must be a positive integer.' });
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
    res.status(500).json({ error: 'Error in tagging service.', details: error.response.data });
  }
});

app.get('/fetch_entries', validateFetchEntriesRequest, async (req, res) => {
  const { entry_id, num_entries, mode } = req.query;
  let queryParams = `?mode=${mode}`;

  if (entry_id) {
    queryParams += `&entry_id=${entry_id}`;
  }

  if (num_entries) {
    queryParams += `&num_entries=${num_entries}`;
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5000/fetch_entries${queryParams}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error in DAL service.', details: error.response.data });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
