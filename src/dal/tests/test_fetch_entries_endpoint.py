import json
import sys

sys.path.append("../")

import unittest
from unittest.mock import patch
from src.app import create_app
import src.app.utils.messages as messages


class TestFetchEntries(unittest.TestCase):
    def setUp(self):
        app = create_app()
        app.testing = True
        self.app = app.test_client()

    @patch("src.app.api.routes.get_collection")
    def test_valid_call_when_db_is_empty(self, mock_get_collection):
        mocked_db_entry = []
        mocked_oldest_entry = None

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?mode=ner")

        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], True)

    @patch("src.app.api.routes.get_collection")
    def test_valid_call_with_end_of_history(self, mock_get_collection):
        mocked_db_entry = [
            {
                "_id": "653e9b4b7290809194e2801c",
                "date": "Tue, 24 Oct 2023 14:30:00 GMT",
                "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]],
            }
        ]
        mocked_oldest_entry = {"_id": "653e9b4b7290809194e2801c"}

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?mode=ner")

        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], True)

    @patch("src.app.api.routes.get_collection")
    def test_valid_call_without_end_of_history(self, mock_get_collection):
        mocked_db_entry = [
            {
                "_id": "653e9b4b7290809194e2801c",
                "date": "Tue, 24 Oct 2023 14:30:00 GMT",
                "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]],
            }
        ]
        mocked_oldest_entry = {"_id": "653e9b4b7290809194e00000"}

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?mode=ner")

        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], False)

    def test_missing_mode(self):
        response = self.app.get("/fetch_entries")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.INVALID_MODE_PARAMETER})

    def test_wrong_mode(self):
        response = self.app.get("/fetch_entries?mode=wrong_mode")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.INVALID_MODE_PARAMETER})

    def test_mode_as_number(self):
        response = self.app.get("/fetch_entries?mode=123")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.INVALID_MODE_PARAMETER})

    @patch("src.app.api.routes.get_collection")
    def test_valid_num_entries_with_end_of_history(self, mock_get_collection):
        mocked_db_entry = [
            {
                "_id": "653e9b4b7290809194e2801c",
                "date": "Tue, 24 Oct 2023 14:30:00 GMT",
                "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]],
            }
        ]
        mocked_oldest_entry = {"_id": "653e9b4b7290809194e2801c"}

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?mode=ner&num_entries=2")

        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], True)

    @patch("src.app.api.routes.get_collection")
    def test_valid_num_entries_without_end_of_history(self, mock_get_collection):
        mocked_db_entry = [
            {
                "_id": "653e9b4b7290809194e2801c",
                "date": "Tue, 24 Oct 2023 14:30:00 GMT",
                "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]],
            }
        ]
        mocked_oldest_entry = {"_id": "653e9b4b7290809194e00000"}

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?mode=ner&num_entries=2")

        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], False)

    def test_num_entries_as_string(self):
        response = self.app.get("/fetch_entries?mode=ner&num_entries=abc")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.NUM_ENTRIES_INVALID})

    def test_num_entries_as_negative_number(self):
        response = self.app.get("/fetch_entries?mode=ner&num_entries=-5")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.NUM_ENTRIES_INVALID})

    def test_num_entries_as_zero(self):
        response = self.app.get("/fetch_entries?mode=ner&num_entries=0")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.NUM_ENTRIES_INVALID})

    @patch("src.app.api.routes.get_collection")
    def test_valid_entry_id_with_end_of_history(self, mock_get_collection):
        mocked_db_entry = [
            {
                "_id": "653e9b4b7290809194e2801c",
                "date": "Tue, 24 Oct 2023 14:30:00 GMT",
                "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]],
            }
        ]
        mocked_oldest_entry = {"_id": "653e9b4b7290809194e2801c"}

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?entry_id=653eac8162d523d831ddcf98&num_entries=5&mode=ner")
        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], True)

    @patch("src.app.api.routes.get_collection")
    def test_valid_entry_id_without_end_of_history(self, mock_get_collection):
        mocked_db_entry = [
            {
                "_id": "653e9b4b7290809194e2801c",
                "date": "Tue, 24 Oct 2023 14:30:00 GMT",
                "tagged_sentence": [["tag11", "word1"], ["tag2", "word2"]],
            }
        ]
        mocked_oldest_entry = {"_id": "653e9b4b7290809194e00000"}

        mock_get_collection.return_value.find_one.return_value = mocked_oldest_entry
        mock_get_collection.return_value.find.return_value.sort.return_value.limit.return_value = (
            mocked_db_entry
        )

        # Make a valid request
        response = self.app.get("/fetch_entries?entry_id=653eac8162d523d831ddcf98&num_entries=5&mode=ner")

        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data["entries"], mocked_db_entry)
        self.assertEqual(response_data["end_of_history"], False)

    @patch("src.app.api.routes.get_collection")
    def test_missing_entry_id(self, mock_get_collection):
        mock_get_collection.return_value.find_one.return_value = None
        response = self.app.get("/fetch_entries?entry_id=653eac8162d523d831ddcf98&num_entries=5&mode=ner")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.ENTRY_ID_NOT_FOUND})

    def test_invalid_entry_id(self):
        response = self.app.get("/fetch_entries?entry_id=653eac8162d523d831ddcf9X&num_entries=5&mode=ner")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": messages.INVALID_ENTRY_ID_FORMAT})

    @patch("src.app.api.routes.get_collection")
    def test_fetch_entries_exception(self, mock_get_collection):
        error_txt = "Database error"

        mock_get_collection.side_effect = Exception(error_txt)

        response = self.app.get("/fetch_entries?mode=pos")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", data)
        self.assertEqual(data["error"], error_txt)
