const express = require('express')
const axios = require('../util/axiosInstance')
const bodyParser = require('body-parser')
const requestValidation = require('../middleware/requestValidation')
const { extractErrorDetails } = require('../util/errorExtractor')
const messages = require('../util/messages')

const router = express.Router()

router.use(bodyParser.json())

router.get('/fetch_entries', requestValidation.validateFetchEntriesRequest, async (req, res) => {
  const { entry_id: entryId, num_entries: numEntries, mode } = req.query
  let queryParams = `?mode=${mode}`

  if (entryId) {
    queryParams += `&entry_id=${entryId}`
  }

  if (numEntries) {
    queryParams += `&num_entries=${numEntries}`
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5000/fetch_entries${queryParams}`)
    res.status(response.status).json(response.data)
  } catch (error) {
    if (error.code === 'ECONNREFUSED') { // The service wasn't avaiable
      return res.status(500).json({
        error: messages.DAL_SERVICE_UNAVAILABLE,
        details: `Please check the DAL service connection. Details: ${error.message}`
      })
    } else { // this is an error reported by the service
      const errorDetails = extractErrorDetails(error)
      return res.status(500).json({
        error: messages.DAL_SERVICE_ERROR,
        details: errorDetails
      })
    }
  }
})

module.exports = router
