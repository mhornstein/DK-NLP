const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { formatISO } = require('date-fns');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // TODO - remove upon production!
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

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

function extractErrorDetails(error) {
  let errorDetails = error.message;

  if (error.response && error.response.data && error.response.data.error) {
    errorDetails = error.response.data.error;
  }

  return errorDetails;
}

// Routes
app.get('/tag', validateTagSentenceRequest, async (req, res) => {
  const { mode, sentence } = req.query;
  let response;
  try {
    response = await axios.get(`http://127.0.0.1:4000/tag?mode=${mode}&sentence=${encodeURIComponent(sentence)}`);
  } catch (error) {
    if (error.code == 'ECONNREFUSED') { // The service wasn't avaiable
      return res.status(500).json({
        error: 'Tagging Service unavailable',
        details: `Please check the tagging service connection. Details: ${error.message}`
      });
    } else { // this is an error reported by the service
      const errorDetails = extractErrorDetails(error);
      return res.status(500).json({
        error: 'Error reported by Tagging Service',
        details: errorDetails
      });
    }
  }

  // update the history in the db with the new tagging
  const now = new Date();
  const date = formatISO(now, { representation: 'complete' });
  const tagged_sentence = response.data.result;

  const postData = {
    date,
    mode,
    tagged_sentence,
  };

  try {
    const dalResponse = await axios.post('http://127.0.0.1:5000/add_entry', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.status(response.status).json(tagged_sentence);
  } catch (error) {
    if (error.code == 'ECONNREFUSED') { // The service wasn't avaiable
      return res.status(503).json({
        error: 'DAL Service unavailable',
        details: `Please check the DAL service connection. Details: ${error.message}`,
        tagged_sentence: tagged_sentence
      });
    } else { // this is an error reported by the service
      const errorDetails = extractErrorDetails(error);
      return res.status(503).json({
        error: 'Error reported by DAL Service',
        details: errorDetails,
        tagged_sentence: tagged_sentence
      });
    }
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
    res.status(500).json({ error: 'Error in DAL service.', details: extractErrorDetails(error) });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});