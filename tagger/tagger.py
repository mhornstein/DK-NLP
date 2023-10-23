import sys
import json
import torch as torch
from torch.utils.data import TensorDataset, DataLoader
import numpy as np
from itertools import zip_longest

'''

Example for config line:

c model_c_pos.pth ./data/pos/test pos ./configs.json
c model_c_ner.pth ./data/ner/test ner ./configs.json

'''

REPR = sys.argv[1]
MODEL_FILE = sys.argv[2]
INPUT_FILE = sys.argv[3]
TASK = sys.argv[4]
CONFIG_DICT = json.load(open(sys.argv[5]))

SENTENCE_END_TOKEN = '\n'
DELIM = ' ' if TASK == 'pos' else '\t'
UNKNOWN_TOKEN = '<UNK>'
PADDING_VALUE = 0

BATCH_SIZE = 1 # classify one sentence at a time

# configs keys
CONFIG_DICT = CONFIG_DICT[TASK]

BILSTM_OUTPUT_DIM = CONFIG_DICT["bilstm_output_dim"]
WORD_EMBEDDING_DIM = CONFIG_DICT["word_embedding_dim"]
SUBWORDS_EMBEDDING_DIM = CONFIG_DICT["subwords_embedding_dim"]

# train output file
MODEL_DIR = f'{TASK}_model'
VOCABS_FILE = f'./{MODEL_DIR}/vocabs'
DICTS_FILE = f'./{MODEL_DIR}/dicts'

# Note: this length can be of words that were in train set but not in vocab.
# The reason: char training took all words into account
MAX_WORD_LENTGH_NER = 61
MAX_WORD_LENTGH_POS = 54

DEFAULT_FOR_UNKNOWN_CHAR = '-'

############################

def load_unlabeled_data(file_path):
    file = open(file_path, "r", encoding="utf-8")

    sentences_words = []
    words = []

    sentences_prefixes = []
    prefixes = []

    sentences_suffixes = []
    suffixes = []

    for line in file:
        if SENTENCE_END_TOKEN != line:
            word = line.strip()
            words.append(word)
            prefixes.append(word[:3])
            suffixes.append(word[-3:])
        else: # The sentence ended - start a new sentence
            sentences_words.append(words)
            sentences_prefixes.append(prefixes)
            sentences_suffixes.append(suffixes)

            words, prefixes, suffixes = [], [], []

    file.close()
    return sentences_words, sentences_prefixes, sentences_suffixes

def lists_to_padded_tensor(lst):
    '''
    converts a list of lists of different sizes to numpy with padding.
    for padding reference see: https://stackoverflow.com/questions/63879780/numpy-array-from-list-of-lists-with-different-length-padding
    '''
    np_array = np.array(list(zip_longest(*lst, fillvalue=PADDING_VALUE))).T
    return torch.LongTensor(np_array)

def create_features(sentences_x, x2i, unknown_token):
    train = []
    for x in sentences_x:
        indexes = [x2i[xj] if xj in x2i else x2i[unknown_token] for xj in x]
        train.append(indexes)
    return np.array(train, dtype=object)

def create_chars_tensor(sentences_words, c2i, max_chars_in_word):
    '''
    Converts a list of words into 3-dim tensor.
    Note: unseen chars will be set to the char DEFAULT_FOR_UNKNOWN_CHAR by default
    '''
    train_chars_features = [[[c2i[c] if c in c2i else c2i[DEFAULT_FOR_UNKNOWN_CHAR] for c in word] for word in sentence] for sentence in sentences_words]
    sentences_dim = len(sentences_words)
    words_dim = max([len(s) for s in sentences_words])

    features = np.zeros((sentences_dim, words_dim, max_chars_in_word), dtype=int)

    for i, words in enumerate(train_chars_features):
        for j, chars in enumerate(words):
            features[i, j, :len(chars)] = np.array(chars)

    return torch.LongTensor(features)

################

# Step #1: load models and vocabs
model = torch.load(f'./{MODEL_DIR}/model.pth')
model.eval()

vocabs = torch.load(VOCABS_FILE)
vocab = vocabs['vocab']
prefix_vocab = vocabs['prefix_vocab']
suffix_vocab = vocabs['suffix_vocab']
char_vocab = vocabs['char_vocab']

dicts = torch.load(DICTS_FILE)
w2i = dicts['w2i']
i2w = dicts['i2w']
p2i = dicts['p2i']
i2p = dicts['i2p']
s2i = dicts['s2i']
i2s = dicts['i2s']
c2i = dicts['c2i']
i2c = dicts['i2c']
t2i = dicts['t2i']
i2t = dicts['i2t']

# Step #2: load the test-set
sentences_words, sentences_prefixes, sentences_suffixes = load_unlabeled_data(INPUT_FILE)
sentences_length = [len(sentence) for sentence in sentences_words]

if REPR == 'a':
    words_features = create_features(sentences_words, w2i, UNKNOWN_TOKEN)
    test_data_set = TensorDataset(lists_to_padded_tensor(words_features),
                                   torch.LongTensor(np.array(sentences_length)))
    test_data_loader = DataLoader(dataset=test_data_set, batch_size=BATCH_SIZE, shuffle=False)
elif REPR == 'b':
    max_chars_in_word = MAX_WORD_LENTGH_POS if TASK == 'pos' else MAX_WORD_LENTGH_NER #max word in train set for pos and ner tasks
    chars_tensor = create_chars_tensor(sentences_words, c2i, max_chars_in_word)

    test_data_set = TensorDataset(chars_tensor,
                                  torch.LongTensor(np.array(sentences_length)))
    test_data_loader = DataLoader(dataset=test_data_set, batch_size=BATCH_SIZE, shuffle=False)

elif REPR == 'c':
    words_features = create_features(sentences_words, w2i, UNKNOWN_TOKEN)
    prefix_features = create_features(sentences_prefixes, p2i, UNKNOWN_TOKEN[:3])
    suffix_features = create_features(sentences_suffixes, s2i, UNKNOWN_TOKEN[-3:])

    test_data_set = TensorDataset(lists_to_padded_tensor(words_features),
                                   lists_to_padded_tensor(prefix_features),
                                   lists_to_padded_tensor(suffix_features),
                                   torch.LongTensor(np.array(sentences_length)))
    test_data_loader = DataLoader(dataset=test_data_set, batch_size=BATCH_SIZE, shuffle=False)

elif REPR == 'd':
    words_features = create_features(sentences_words, w2i, UNKNOWN_TOKEN)

    max_chars_in_word = MAX_WORD_LENTGH_POS if TASK == 'pos' else MAX_WORD_LENTGH_NER #max word in train set for pos and ner tasks
    chars_tensor = create_chars_tensor(sentences_words, c2i, max_chars_in_word)

    test_data_set = TensorDataset(lists_to_padded_tensor(words_features),
                                   chars_tensor,
                                   torch.LongTensor(np.array(sentences_length)))
    test_data_loader = DataLoader(dataset=test_data_set, batch_size=BATCH_SIZE, shuffle=False)

else:
    raise Exception("Unknown representation: " + REPR)


# Step #3: Start predicting
f = open("./test4." + TASK, "w")

with torch.no_grad():
    for words, batch in zip(sentences_words, test_data_loader):
        output = model(*batch)
        prediction = np.argmax(output, axis=-1)
        tags = [i2t[pred.item()] for pred in prediction[0]]

        for word, tag in zip(words, tags):
            f.write("{0} {1}\n".format(word, tag))
        f.write("\n")
f.close()