import unittest
import json
from unittest.mock import patch
from app import app
import app.messages as messages

class TestAddEntryEndpoint(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    @patch('app.routes.get_collection')
    def test_add_valid_entry(self, mock_get_collection):
        mock_get_collection.return_value.insert_one.return_value = None

        valid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'pos',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=valid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 201)
        self.assertIn('message', data)
        mock_get_collection.assert_called_with('pos')  # Ensure the correct mode is used
        mock_get_collection.return_value.insert_one.assert_called_once()
        self.assertEqual(data['message'], messages.TAG_ADDED_SUCCESSFULLY)

    def test_missing_mode(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_DATA_KEYS)

    def test_wrong_mode(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'wrong_mode',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_MODE)

    def test_mode_as_number(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 123,  # Mode as a number
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_MODE)

if __name__ == '__main__':
    unittest.main()