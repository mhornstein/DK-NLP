from flask import request, jsonify, Blueprint
from ..services.tagger_util import get_tagger
from ..utils import messages

api_blueprint = Blueprint("tag_route_blueprint", __name__)


@api_blueprint.route("/tag", methods=["GET"])
def tag_sentence():
    """
    Tags a sentence based on the specified mode ('pos' or 'ner').

    URL: GET /tag

    Request Parameters:
    - mode (string, required): Specifies the tagging mode. It can be either "pos" for Part-of-Speech or "ner" for Named Entity Recognition.
    - sentence (string, required): The sentence you want to tag.

    # Example 1: Tag a sentence with Part-of-Speech (POS) mode, assuming URI is local host:
    curl "http://localhost:4000/tag?mode=pos&sentence=How%20John%20is%20doing%20in%20Japan%3F"
    Output: {"result": [["How", "WRB"], ["Dudi", "NNP"], ["is", "VBZ"], ["doing", "VBG"], ["in", "IN"], ["Japan", "NNP"], ["?", "."]]

    # Example 2: Tag a sentence with Named Entity Recognition (NER) mode, assuming URI is local host:
    curl "http://localhost:4000/tag?mode=ner&sentence=How%20John%20is%20doing%20in%20Japan%3F"
    Output: {"result": [["How", "O"], ["John", "PER"], ["is", "O"], ["doing", "O"], ["in", "O"], ["Japan", "LOC"], ["?", "O"]]}
    """
    mode = request.args.get("mode")
    sentence = request.args.get("sentence")

    if mode is None or sentence is None:
        return jsonify({"error": messages.MODE_AND_SENTENCE_REQUIRED_ERROR}), 400

    if mode not in ["ner", "pos"]:
        return jsonify({"error": messages.INVALID_MODE_ERROR}), 400

    if not isinstance(sentence, str) or len(sentence) < 1:
        return jsonify({"error": messages.INVALID_SENTENCE_LENGTH_ERROR}), 400

    try:
        tagger = get_tagger(mode)
        result = tagger.tag(sentence)

        return jsonify({"result": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
