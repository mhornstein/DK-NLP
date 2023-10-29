# validate_entry_data messages
INVALID_JSON_OBJECT = 'Data must be a JSON object'
INVALID_DATA_KEYS = 'Data must have exactly three keys: mode, date, tagged_sentence'
INVALID_MODE = 'Invalid mode. Mode should be either "ner" or "pos"'
INVALID_DATE_FORMAT = 'Invalid date format. Date should be in the format: 2023-10-24T14:30:00+00:00'
INVALID_TAGGED_SENTENCE_TYPE = 'tagged_sentence must be a list of lists'
TAGGED_SENTENCE_LENGTH_EXCEEDED = 'tagged_sentence cannot have more than 250 elements'
INVALID_TAGGED_SENTENCE_STRUCTURE = 'tagged_sentence should be a list of lists, each containing two strings'

# add_entry messages
TAG_ADDED_SUCCESSFULLY = 'Tag added successfully'

# fetch_entries messages
NUM_ENTRIES_INVALID = 'num_entries must be a positive integer'
INVALID_MODE_PARAMETER = 'Invalid mode: Mode is mandatory and should be either "ner" or "pos"'
ENTRY_ID_NOT_FOUND = 'entry_id not found in the database'
