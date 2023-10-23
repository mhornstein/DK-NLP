import torch as torch
import nltk
from nltk.tokenize import word_tokenize
import numpy as np
from torch.utils.data import TensorDataset, DataLoader

nltk.download('punkt')  # Download the NLTK data required for tokenization
UNKNOWN_TOKEN = '<UNK>'
PADDING_VALUE = 0
MAX_SENTENCE_LENGTH = 100

class Tagger:
    def __init__(self, model_path, vocab_file, dicts_file):
        self.model = torch.load(model_path)
        self.model.eval()

        vocabs = torch.load(vocab_file)
        self.vocab = vocabs['vocab']
        self.prefix_vocab = vocabs['prefix_vocab']
        self.suffix_vocab = vocabs['suffix_vocab']

        dicts = torch.load(dicts_file)
        self.w2i = dicts['w2i']
        self.i2w = dicts['i2w']
        self.p2i = dicts['p2i']
        self.i2p = dicts['i2p']
        self.s2i = dicts['s2i']
        self.i2s = dicts['i2s']
        self.i2t = dicts['i2t']

    def create_features(self, sentences_x, x2i, unknown_token):
        indexes = [x2i[xj] if xj in x2i else x2i[unknown_token] for xj in sentences_x]
        return np.array([indexes], dtype='int32')

    def list_to_tensor(self, lst):
        lst = [[item for item in sub_list] for sub_list in lst]
        return torch.LongTensor(lst)

    def tag(self, sent):
        tokens = word_tokenize(sent)
        sent_length = len(tokens)

        if sent_length >= MAX_SENTENCE_LENGTH:
            raise Exception(f'Sentence is too long - it contains {sent_length} tokens while maximum allowed is {MAX_SENTENCE_LENGTH}: {sent}')

        sentence_words = tokens
        sentence_prefixes = [t[:3] for t in tokens]
        sentence_suffixes = [t[-3:] for t in tokens]

        words_features = self.create_features(sentence_words, self.w2i, UNKNOWN_TOKEN)
        prefix_features = self.create_features(sentence_prefixes,self. p2i, UNKNOWN_TOKEN[:3])
        suffix_features = self.create_features(sentence_suffixes, self.s2i, UNKNOWN_TOKEN[-3:])

        test_data_set = TensorDataset(self.list_to_tensor(words_features),
                                      self.list_to_tensor(prefix_features),
                                      self.list_to_tensor(suffix_features),
                                      torch.LongTensor(np.array([sent_length])))
        test_data_loader = DataLoader(dataset=test_data_set, batch_size=1, shuffle=False)

        with torch.no_grad():
            for words, batch in zip([sentence_words], test_data_loader):
                output = self.model(*batch)
                prediction = np.argmax(output, axis=-1)
                tags = [self.i2t[pred.item()] for pred in prediction[0]]

                for word, tag in zip(words, tags):
                    print("{0} {1}".format(word, tag))

if __name__ == '__main__':
    pos_tagger = Tagger(model_path='./pos_model/model.pth', vocab_file='./pos_model/vocabs', dicts_file='./pos_model/dicts')
    pos_tagger.tag("Influential members of the House Ways and Means Committee introduced legislation that would restrict how the new savings-and-loan bailout agency can raise capital, creating another potential obstacle to the government's sale of sick thrifts.")

    ner_tagger = Tagger(model_path='./ner_model/model.pth', vocab_file='./ner_model/vocabs', dicts_file='./ner_model/dicts')
    #ner_tagger.tag("Japan began the defense of their Asian Cup title with a lucky 2-1 win against Syria in a Group C championship match on Friday.")