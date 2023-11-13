import sys
sys.path.append('../')

import unittest
import json
from unittest.mock import patch
from app import create_app
import app.messages as messages

class TestAddEntryEndpoint(unittest.TestCase):
    def setUp(self):
        app = create_app()
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

    def test_missing_date(self):
        invalid_data = {
            'mode': 'pos',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_DATA_KEYS)

    def test_wrong_date_format(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00',  # Missing timezone information
            'mode': 'pos',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_DATE_FORMAT)

    def test_date_as_number(self):
        invalid_data = {
            'date': 123,  # Date as a number
            'mode': 'pos',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_DATE_FORMAT)

    def test_missing_tagged_sentence(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'pos'
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_DATA_KEYS)

    def test_invalid_tagged_sentence_structure(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'pos',
            'tagged_sentence': [['tag1', 'word1'], ['tag2', 'word2', 'extra']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_TAGGED_SENTENCE_STRUCTURE)

    def test_invalid_tagged_sentence_element(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'pos',
            'tagged_sentence': [['tag1', 'word1'], ['tag2', 123]]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_TAGGED_SENTENCE_STRUCTURE)

    def test_invalid_data_type(self):
        invalid_data = "not_a_dictionary"
        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_JSON_OBJECT)

    def test_missing_required_keys(self):
        invalid_data = {
            'mode': 'pos',
            'mispelled_date': '2023-10-24T14:30:00+00:00', # note that this is an incorrect key
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }
        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_DATA_KEYS)

    def test_invalid_tagged_sentence_type(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'ner',
            'tagged_sentence': "tagged_sentence is not a list and therefore not valid"
        }
        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.INVALID_TAGGED_SENTENCE_TYPE)

    def test_tagged_sentence_length_exceeded(self):
        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'pos',
            'tagged_sentence': [['tag11', 'word1']] * 251  # tagged_sentence exceeds the length limit
        }
        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], messages.TAGGED_SENTENCE_LENGTH_EXCEEDED)

    @patch('app.routes.get_collection')
    def test_add_entry_exception(self, mock_get_collection):
        error_txt = "Database error"
        mock_get_collection.return_value.insert_one.side_effect = Exception(error_txt)

        invalid_data = {
            'date': '2023-10-24T14:30:00+00:00',
            'mode': 'pos',
            'tagged_sentence': [['tag11', 'word1'], ['tag2', 'word2']]
        }

        response = self.app.post('/add_entry', json=invalid_data, content_type='application/json')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 500)
        self.assertIn('error', data)
        self.assertEqual(data['error'], error_txt)
