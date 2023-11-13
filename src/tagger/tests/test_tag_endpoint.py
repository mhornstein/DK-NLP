import sys

sys.path.append("../")

import unittest
from unittest.mock import patch
from src.app import create_app
import src.app.utils.messages as messages


class TestTagEndpoint(unittest.TestCase):
    def setUp(self):
        app = create_app()
        app.testing = True
        self.client = app.test_client()

    @patch("src.app.api.routes.get_tagger")
    def test_valid_call(self, mock_get_tagger):
        tagged_sentence = [
            ["How", "WRB"],
            ["John", "NNP"],
            ["is", "VBZ"],
            ["doing", "VBG"],
            ["in", "IN"],
            ["Japan", "NNP"],
            ["?", "."],
        ]

        mock_get_tagger.return_value.tag.return_value = tagged_sentence

        response = self.client.get("/tag?mode=pos&sentence=How%20John%20is%20doing%20in%20Japan%3F")
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {"result": tagged_sentence})

    def test_missing_mode(self):
        response = self.client.get("/tag?sentence=How%20John%20is%20doing%20in%20Japan%3F")
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {"error": messages.MODE_AND_SENTENCE_REQUIRED_ERROR})

    def test_wrong_mode(self):
        response = self.client.get("/tag?mode=wrong_mode&sentence=How%20John%20is%20doing%20in%20Japan%3F")
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {"error": messages.INVALID_MODE_ERROR})

    def test_mode_as_number(self):
        response = self.client.get("/tag?mode=123&sentence=How%20John%20is%20doing%20in%20Japan%3F")
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {"error": messages.INVALID_MODE_ERROR})

    def test_sentence_missing(self):
        response = self.client.get("/tag?mode=pos")
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {"error": messages.MODE_AND_SENTENCE_REQUIRED_ERROR})

    def test_empty_sentence(self):
        response = self.client.get("/tag?mode=pos&sentence=")
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {"error": messages.INVALID_SENTENCE_LENGTH_ERROR})

    @patch("src.app.api.routes.get_tagger")
    def test_tagger_exception(self, mock_get_tagger):
        mock_get_tagger.side_effect = Exception("Simulated exception")
        response = self.client.get("/tag?mode=pos&sentence=How%20John%20is%20doing%20in%20Japan%3F")
        self.assertEqual(response.status_code, 500)
        expected_response = {"error": "Simulated exception"}
        self.assertEqual(response.get_json(), expected_response)
