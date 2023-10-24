from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import sys
from bson import ObjectId

app = Flask(__name__)

# MongoDB Configuration
mongo_url = sys.argv[1] if len(sys.argv) >= 2 else 'localhost'
mongo_port = sys.argv[2] if len(sys.argv) >= 3 else '27017'
MONGO_URI = f'mongodb://{mongo_url}:{mongo_port}/'
client = MongoClient(MONGO_URI)
print(f'Listening on: {MONGO_URI}')

DB_NAME = "tags"

db = client[DB_NAME]  # create the "tags" database if it doesn't exist

def create_collection_if_not_exists(collection_name):
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)

# Create collections for 'ner' and 'pos'
create_collection_if_not_exists("ner_collection")
create_collection_if_not_exists("pos_collection")

def validate_entry_data(data):
    '''
    Validates the structure and content of input data for an entry.

    Parameters:
        data (dict): The input data to be validated.

    Returns:
        str or None: If validation fails, returns an error message. If validation passes, returns None.
    '''
    if not isinstance(data, dict):
        return 'Data must be a JSON object'

    if len(data) != 3:
        return 'Data must have exactly three keys: mode, date, tagged_sentence'

    data_keys = list(data.keys())
    if not all(key in data_keys for key in ['mode', 'date', 'tagged_sentence']):
        return 'Data keys must include the following keys: mode, date, tagged_sentence'

    if data['mode'] not in ['ner', 'pos']:
        return 'Invalid mode. Mode should be either "ner" or "pos'

    try:
        date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S%z')
    except ValueError:
        return 'Invalid date format. Date should be in the format: 2023-10-24T14:30:00+00:00'

    if not isinstance(data['tagged_sentence'], list):
        return 'tagged_sentence must be a list of lists'

    if len(data['tagged_sentence']) > 250:
        return 'tagged_sentence cannot have more than 250 elements'

    for item in data['tagged_sentence']:
        if not (isinstance(item, list) and len(item) == 2 and all(isinstance(el, str) for el in item)):
            return 'tagged_sentence should be a list of lists, each containing two strings'

    return None

@app.route('/add_entry', methods=['POST'])
def add_entry():
    '''
    To add a new tag, send a POST request to this endpoint with JSON data containing a date and tagged_sentence.

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
        history_collection = db['ner_collection'] if mode == 'ner' else db['pos_collection']
        history_collection.insert_one(data)
        return jsonify({'message': 'Tag added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/fetch_entries', methods=['GET'])
def fetch_entries():
    '''
    To fetch tagged entries, send a GET request to this endpoint.

    Query Parameters:
    - 'entry_id' (optional): The ID of the entry from which to start fetching.
    - 'num_entries' (optional): The maximum number of entries to fetch (with regard to the db capacity). Default is 10 entries.
    - 'mode' (mandatory): The tagging mode to filter entries by. Options are "ner" or "pos."

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
            return jsonify({'error': "num_entries must be a positive integer."}), 400

        if mode is None or mode not in ['ner', 'pos']:
            return jsonify({'error': 'Invalid mode: Mode is mandatory and should be either "ner" or "pos"'}), 400

        history_collection = db[mode + '_collection']

        if entry_id is not None and not history_collection.find_one({"_id": ObjectId(entry_id)}):
            return jsonify({'error': "entry_id not found in the database."}), 400

        query = {}
        if entry_id:
            query['_id'] = {'$lt': ObjectId(entry_id)}

        entries = list(history_collection.find(query).sort([('_id', -1)]).limit(num_entries))
        result = [{"_id": str(entry['_id']), "date": entry['date'], "tagged_sentence": entry['tagged_sentence']} for entry in entries]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
