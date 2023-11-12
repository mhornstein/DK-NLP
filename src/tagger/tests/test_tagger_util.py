import unittest
from src.app.services.tagger_util import Tagger


class TestTagger(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Initialize the taggers before running the tests
        cls.pos_tagger = Tagger(
            model_path="../src/app/models/pos_model/model.pth",
            vocab_file="../src/app/models/pos_model/vocabs",
            dicts_file="../src/app/models/pos_model/dicts",
        )
        cls.ner_tagger = Tagger(
            model_path="../src/app/models/ner_model/model.pth",
            vocab_file="../src/app/models/ner_model/vocabs",
            dicts_file="../src/app/models/ner_model/dicts",
        )

    def test_tag_pos(self):
        sentence = "This is a test sentence."
        tags = self.pos_tagger.tag(sentence)
        expected_tags = [
            ["This", "DT"],
            ["is", "VBZ"],
            ["a", "DT"],
            ["test", "NN"],
            ["sentence", "NN"],
            [".", "."],
        ]
        self.assertIsInstance(tags, list)
        self.assertEqual(tags, expected_tags)

    def test_tag_ner(self):
        sentence = "Google is an organization based in San Francisco, California."
        tags = self.ner_tagger.tag(sentence)
        expected_tags = [
            ["Google", "ORG"],
            ["is", "O"],
            ["an", "O"],
            ["organization", "O"],
            ["based", "O"],
            ["in", "O"],
            ["San", "LOC"],
            ["Francisco", "LOC"],
            [",", "O"],
            ["California", "LOC"],
            [".", "O"],
        ]
        self.assertIsInstance(tags, list)
        self.assertEqual(tags, expected_tags)

    def test_tag_long_sentence(self):
        sentence = " ".join(["word"] * 200)
        with self.assertRaises(Exception):
            self.pos_tagger.tag(sentence)

    def tearDown(self):
        pass
