const messages = require('../util/messages')

function validateTagSentenceRequest (req, res, next) {
  const { mode, sentence } = req.query

  if (!mode || (mode !== 'ner' && mode !== 'pos') || !sentence) {
    res.status(400).json({ error: messages.INVALID_PARAMETER_ERROR, details: messages.INVALID_TAG_REQUEST })
  } else {
    next()
  }
}

function validateFetchEntriesRequest (req, res, next) {
  const mode = req.query.mode
  const numEntries = req.query.num_entries

  if (!mode || (mode !== 'ner' && mode !== 'pos')) {
    res.status(400).json({ error: messages.INVALID_PARAMETER_ERROR, details: messages.ILLEGAL_OR_MISSING_MODE })
  } else if (numEntries && !Number.isInteger(Number(numEntries))) {
    res.status(400).json({ error: messages.INVALID_PARAMETER_ERROR, details: messages.NUM_ENTRIES_MUST_BE_INT })
  } else if (numEntries && Number.isInteger(Number(numEntries)) && Number(numEntries) <= 0) {
    res.status(400).json({ error: messages.INVALID_PARAMETER_ERROR, details: messages.NUM_ENTRIES_MUST_BE_POSITIVE })
  } else {
    next()
  }
}

module.exports = {
  validateTagSentenceRequest,
  validateFetchEntriesRequest
}
