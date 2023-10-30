import sys
sys.path.append('../')

import unittest
from unittest.mock import patch
from app import app

class TestTagEndpoint(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    @patch('app.routes.get_tagger')
    def test_valid_call(self, mock_get_tagger):
        tagged_sentence = [["How","WRB"],["John","NNP"],["is","VBZ"],["doing","VBG"],["in","IN"],["Japan","NNP"],["?","."]]

        mock_get_tagger.return_value.tag.return_value = tagged_sentence

        response = self.client.get('/tag?mode=pos&sentence=How%20John%20is%20doing%20in%20Japan%3F')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {'result': tagged_sentence})