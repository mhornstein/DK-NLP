import sys
sys.path.append('../')

import unittest
from unittest.mock import patch
from app import app
import app.messages as messages

class TestFetchEntries(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    @patch('app.routes.get_collection')
    def test_valid_call(self, mock_get_collection):
        mocked_db_entry = [{"_id": "653e9b4b7290809194e2801c", "date": "Tue, 24 Oct 2023 14:30:00 GMT",
             "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]]}]

        mock_get_collection.return_value.find_one.return_value = 'some returned value'
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = mocked_db_entry

        # Make a valid request
        response = self.app.get('/fetch_entries?mode=ner')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), mocked_db_entry)

    def test_missing_mode(self):
        response = self.app.get('/fetch_entries')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': messages.INVALID_MODE_PARAMETER})

    def test_wrong_mode(self):
        response = self.app.get('/fetch_entries?mode=wrong_mode')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': messages.INVALID_MODE_PARAMETER})

    def test_mode_as_number(self):
        response = self.app.get('/fetch_entries?mode=123')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': messages.INVALID_MODE_PARAMETER})

if __name__ == '__main__':
    unittest.main()
