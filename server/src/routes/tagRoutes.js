const express = require('express')
const axios = require('../util/axiosInstance')
const bodyParser = require('body-parser')
const requestValidation = require('../middleware/requestValidation')
const { extractErrorDetails } = require('../util/errorExtractor')
const { formatISO } = require('date-fns')
const messages = require('../util/messages')

module.exports = (taggerUri, dalUri) => {
  const router = express.Router()

  router.use(bodyParser.json())

  router.get('/tag', requestValidation.validateTagSentenceRequest, async (req, res) => {
    const { mode, sentence } = req.query
    let response
    try {
      response = await axios.get(`http://${taggerUri}/tag?mode=${mode}&sentence=${encodeURIComponent(sentence)}`)
    } catch (error) {
      if (error.code === 'ECONNREFUSED') { // The service wasn't avaiable
        return res.status(500).json({
          error: messages.TAGGING_SERVICE_UNAVAILABLE,
          details: `Please check the tagging service connection. Details: ${error.message}`
        })
      } else { // this is an error reported by the service
        const errorDetails = extractErrorDetails(error)
        return res.status(500).json({
          error: messages.ERROR_REPORTED_BY_TAGGING_SERVICE,
          details: errorDetails
        })
      }
    }

    // update the history in the db with the new tagging
    const now = new Date()
    const date = formatISO(now, { representation: 'complete' })
    const taggedSentence = response.data.result

    const postData = {
      date,
      mode,
      tagged_sentence: taggedSentence
    }

    try {
      await axios.post(`http://${dalUri}/add_entry`, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return res.status(response.status).json(taggedSentence)
    } catch (error) {
      if (error.code === 'ECONNREFUSED') { // The service wasn't avaiable
        return res.status(503).json({
          error: messages.DAL_SERVICE_UNAVAILABLE,
          details: `Please check the DAL service connection. Details: ${error.message}`,
          tagged_sentence: taggedSentence
        })
      } else { // this is an error reported by the service
        const errorDetails = extractErrorDetails(error)
        return res.status(503).json({
          error: messages.DAL_SERVICE_ERROR,
          details: errorDetails,
          tagged_sentence: taggedSentence
        })
      }
    }
  })

  return router
}
