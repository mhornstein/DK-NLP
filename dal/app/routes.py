from datetime import datetime
from flask import request, jsonify
from bson import ObjectId
from app import app
import app.messages as messages
from app.db_util import get_collection

def validate_entry_data(data):
    '''
    Validates the structure and content of input data for an entry.

    Parameters:
        data (dict): The input data to be validated.

    Returns:
        str or None: If validation fails, returns an error message. If validation passes, returns None.
    '''
    if not isinstance(data, dict):
        return messages.INVALID_JSON_OBJECT

    if len(data) != 3:
        return messages.INVALID_DATA_KEYS

    data_keys = list(data.keys())
    if not all(key in data_keys for key in ['mode', 'date', 'tagged_sentence']):
        return messages.INVALID_DATA_KEYS

    if data['mode'] not in ['ner', 'pos']:
        return messages.INVALID_MODE

    try:
        date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S%z')
    except Exception:
        return messages.INVALID_DATE_FORMAT

    if not isinstance(data['tagged_sentence'], list):
        return messages.INVALID_TAGGED_SENTENCE_TYPE

    if len(data['tagged_sentence']) > 250:
        return messages.TAGGED_SENTENCE_LENGTH_EXCEEDED

    for item in data['tagged_sentence']:
        if not (isinstance(item, list) and len(item) == 2 and all(isinstance(el, str) for el in item)):
            return messages.INVALID_TAGGED_SENTENCE_STRUCTURE

    return None

@app.route('/add_entry', methods=['POST'])
def add_entry():
    '''
    To add a new tag, send a POST request to this endpoint with JSON data containing a date and tagged_sentence.

    Parameters:
        - date (str, required): A date in ISO 8601 format with timezone information (e.g., "2023-10-24T14:30:00+00:00").
        - mode (str, required): A string specifying the tagging mode, either "ner" (Named Entity Recognition) or "pos" (Part-of-Speech tagging).
        - tagged_sentence (list of lists, required): A list of tagged words, where each inner list contains two elements:
            - The first element is a tag (str).
            - The second element is the corresponding word (str).

    Example for Curl command:
        curl -X POST -H "Content-Type: application/json" -d "{\"date\":\"2023-10-24T14:30:00+00:00\",\"mode\":\"ner\",\"tagged_sentence\":[[\"tag11\",\"word1\"],[\"tag2\",\"word2\"]]}" http://localhost:5000/add_entry
    '''
    try:
        data = request.get_json()
        error_message = validate_entry_data(data)

        if error_message:
            return jsonify({'error': error_message}), 400

        mode = data['mode']
        data['date'] = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S%z')  # Parse the date string into a datetime object
        history_collection = get_collection(mode)
        history_collection.insert_one(data)
        return jsonify({'message': messages.TAG_ADDED_SUCCESSFULLY}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/fetch_entries', methods=['GET'])
def fetch_entries():
    '''
    To fetch tagged entries, send a GET request to this endpoint.

    Query Parameters:
    - entry_id (hex number, optional): The ID of the entry from which to start fetching.
    - num_entries (int, optional): The maximum number of entries to fetch (with regard to the db capacity). Default is 10 entries.
    - mode (string, required): The tagging mode to filter entries by. Options are "ner" or "pos."

    Example Usage with 'curl':
    - Retrieve 10 entries from a specific mode (e.g., "ner"):
      curl "http://localhost:5000/fetch_entries?mode=ner"

    - Retrieve 5 entries starting from a specific entry ID and filter by mode:
      curl "http://localhost:5000/fetch_entries?entry_id=<entry_id>&num_entries=5&mode=pos"
    '''
    try:
        entry_id = request.args.get('entry_id')
        num_entries = int(request.args.get('num_entries', 10))
        mode = request.args.get('mode')

        if not isinstance(num_entries, int) or num_entries <= 0:
            return jsonify({'error': messages.NUM_ENTRIES_INVALID}), 400

        if mode is None or mode not in ['ner', 'pos']:
            return jsonify({'error': messages.INVALID_MODE_PARAMETER}), 400

        history_collection = get_collection(mode)

        if entry_id is not None and not history_collection.find_one({"_id": ObjectId(entry_id)}):
            return jsonify({'error': messages.ENTRY_ID_NOT_FOUND}), 400

        query = {}
        if entry_id:
            query['_id'] = {'$lt': ObjectId(entry_id)}

        entries = list(history_collection.find(query).sort([('_id', -1)]).limit(num_entries))
        result = [{"_id": str(entry['_id']), "date": entry['date'], "tagged_sentence": entry['tagged_sentence']} for entry in entries]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500