const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const requestValidation = require('../middleware/requestValidation');
const { extractErrorDetails } = require('../util/errorExtractor');

const router = express.Router();

router.use(bodyParser.json());

router.get('/fetch_entries', requestValidation.validateFetchEntriesRequest, async (req, res) => {
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
      if (error.code == 'ECONNREFUSED') { // The service wasn't avaiable
        return res.status(500).json({
          error: 'DAL Service unavailable',
          details: `Please check the DAL service connection. Details: ${error.message}`,
        });
      } else { // this is an error reported by the service
        const errorDetails = extractErrorDetails(error);
        return res.status(500).json({
          error: 'Error reported by DAL Service',
          details: errorDetails,
        });
      }
    }
});

module.exports = router;
