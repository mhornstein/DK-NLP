const messages = require('../util/messages')

function validateTagSentenceRequest (req, res, next) {
  const { mode, sentence } = req.query

  if (!mode || (mode !== 'ner' && mode !== 'pos') || !sentence) {
    res.status(400).json({ error: messages.INVALID_TAG_REQUEST })
  } else {
    next()
  }
}

function validateFetchEntriesRequest (req, res, next) {
  const { entry_id, num_entries, mode } = req.query

  if (!mode || (mode !== 'ner' && mode !== 'pos')) {
    res.status(400).json({ error: messages.ILLEGAL_OR_MISSING_MODE })
  } else if (num_entries && !Number.isInteger(Number(num_entries))) {
    res.status(400).json({ error: messages.NUM_ENTRIES_MUST_BE_INT })
  } else if (num_entries && Number.isInteger(Number(num_entries)) && Number(num_entries) <= 0) {
    res.status(400).json({ error: messages.NUM_ENTRIES_MUST_BE_POSITIVE })
  } else {
    next()
  }
}

module.exports = {
  validateTagSentenceRequest,
  validateFetchEntriesRequest
}
