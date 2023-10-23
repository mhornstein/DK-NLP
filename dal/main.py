from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import sys

app = Flask(__name__)

# MongoDB Configuration
mongo_url = sys.argv[1] if len(sys.argv) >= 2 else 'localhost'
mongo_port = sys.argv[2] if len(sys.argv) >= 3 else '27017'
MONGO_URI = f'mongodb://{mongo_url}:{mongo_port}/'
client = MongoClient(MONGO_URI)
print(f'Listening on: {MONGO_URI}')

DB_NAME = "tags"
COLLECTION_NAME = "history"

db = client[DB_NAME]  # create the "tags" database if it doesn't exist

if COLLECTION_NAME not in db.list_collection_names(): # Create the 'history' collection if it does not exist
    db.create_collection(COLLECTION_NAME)
history_collection = db[COLLECTION_NAME]

# Endpoint to add data to the database
@app.route('/add_entry', methods=['POST'])
def add_entry():
    '''
    To add a new tag, send a POST request to this endpoint with JSON data containing a date and tagged_sentence.

    Example for Curl command:
        curl -X POST -H "Content-Type: application/json" -d "{\"date\":\"2023-10-24T14:30:00+00:00\",\"tagged_sentence\":[[\"tag11\",\"word1\"],[\"tag2\",\"word2\"]]}" http://localhost:5000/add_entry
    '''
    try:
        data = request.get_json()
        if 'date' in data and 'tagged_sentence' in data:
            data['date'] = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S%z') # Parse the date string into a datetime object
            history_collection.insert_one(data)
            return jsonify({'message': 'Tag added successfully'}), 201
        else:
            return jsonify({'error': 'Invalid JSON format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to fetch data from the database
@app.route('/fetch_entries', methods=['GET'])
def fetch_entries():
    '''
    To fetch tagged entries, send a GET request to this endpoint.
    You can provide the 'entry_id' and 'num_entries' query parameters to customize the query.
    - 'entry_id' (optional): The ID of the entry from which to start fetching.
    - 'num_entries' (optional): The number of entries to fetch. Default is 10 entries.
    Example usage with 'curl':
    curl http://localhost:5000/fetch_entries
    curl http://localhost:5000/fetch_entries?entry_id=<entry_id>&num_entries=<number>
    '''
    try:
        entry_id = request.args.get('entry_id')
        num_entries_to_fetch = int(request.args.get('num_entries_to_fetch', 10))

        query = {}
        if entry_id:
            query['_id'] = {'$lt': entry_id}

        entries = list(history_collection.find(query).sort([('_id', -1)]).limit(num_entries_to_fetch))
        result = [{"_id": str(entry['_id']), "date": entry['date'], "tagged_sentence": entry['tagged_sentence']} for entry in entries]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
