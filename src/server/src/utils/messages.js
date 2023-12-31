module.exports = {
  // server errors
  SERVER_ERROR: 'Error reported by server',
  // tag errors
  INVALID_TAG_REQUEST: 'Invalid mode or sentence parameters. Mode must be "ner" or "pos". Sentence is required.',
  // fetchEntries errors
  ILLEGAL_OR_MISSING_MODE: 'Invalid mode parameter. It is mandatory and must be "ner" or "pos".',
  NUM_ENTRIES_MUST_BE_POSITIVE: 'Invalid num_entries parameter. It must be an integer and a positive number.',
  NUM_ENTRIES_MUST_BE_INT: 'Invalid num_entries parameter. It must be an integer.',
  // tagger serevice errors
  ERROR_REPORTED_BY_TAGGING_SERVICE: 'Error reported by Tagging Service',
  TAGGING_SERVICE_UNAVAILABLE: 'Tagging Service unavailable',
  // dal service errors
  DAL_SERVICE_UNAVAILABLE: 'DAL Service unavailable',
  DAL_SERVICE_ERROR: 'Error reported by DAL Service'
}
