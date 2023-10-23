from flask import Flask, request, jsonify
from tagger import Tagger

app = Flask(__name__)

pos_tagger = Tagger(model_path='./pos_model/model.pth', vocab_file='./pos_model/vocabs', dicts_file='./pos_model/dicts')
ner_tagger = Tagger(model_path='./ner_model/model.pth', vocab_file='./ner_model/vocabs', dicts_file='./ner_model/dicts')

@app.route('/tag', methods=['GET'])
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
    mode = request.args.get('mode')
    sentence = request.args.get('sentence')

    if mode is None or sentence is None:
        return jsonify({'error': 'Both "mode" and "sentence" parameters are required.'}), 400

    if mode not in ['ner', 'pos']:
        return jsonify({'error': 'Invalid "mode" parameter. It should be either "ner" or "pos".'}), 400

    if not isinstance(sentence, str) or len(sentence) < 1:
        return jsonify({'error': 'The "sentence" parameter must be a string with a length of at least 1 character.'}), 400

    try:
        if mode == 'pos':
            result = pos_tagger.tag(sentence)
        else:
            result = ner_tagger.tag(sentence)

        return jsonify({'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=4000)
