import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence
import torch as torch

class BiLSTM_Tagger_A(nn.Module):
    '''
    This class is created mostly by using the reference:
    https://galhever.medium.com/sentiment-analysis-with-pytorch-part-4-lstm-bilstm-model-84447f6c4525
    '''

    def __init__(self, vocab_size, embedding_dim, pad_index, lstm_layers, lstm_units, num_classes):
        super(BiLSTM_Tagger_A, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=pad_index)

        self.lstm = nn.LSTM(embedding_dim,
                            lstm_units,
                            num_layers=lstm_layers,
                            bidirectional=True,
                            batch_first=True)

        self.linear = nn.Linear(lstm_units * 2, num_classes) # multiple lstm output in 2 for two directions. lstm output is the input to the linear layer

    def forward(self, text, text_lengths):
        # Step #1: transform text => embeddings.
        # Input size: batch_size X max_sentence_length (e.g. 128 X 141)
        # output size: batch_size X max_sentence_length X word_embedding_length (e.g. 128 X 141 X 50)

        embedded = self.embedding(text)

        # Step #2: handle padding + insert to the bilstm.
        # Input size: batch_size X max_sentence_length X word_embedding_length (e.g. 128 X 141 X 50)
        # output size: batch_size X longest_sentence_in_batch X 2*lstm_output_shape (e.g. 128 X 58 X 1024)

        # The pack_padded_sequence is a format that enables the model to ignore the padded elements (LSTM model does not distinguish between padded elements and regular elements)
        packed_embedded = pack_padded_sequence(embedded, text_lengths, batch_first=True)

        output, (h_n, c_n) = self.lstm(packed_embedded)

        # The pad_packed_sequence function is a reversed operation for pack_padded_sequence and will bring the output back to the familiar format [batch_size, sentence_length, hidden_features]
        output_unpacked, output_lengths = pad_packed_sequence(output, batch_first=True)

        # Step #3: flatten the tensor so it is only words_length X word_representation. Then, feed to linear layer.
        # Input size: batch_size X longest_sentence_in_batch X 2*lstm_output_shape (e.g. 128 X 58 X 1024)
        # Output_size: words X tags (e.g. 128*58 X 46)

        x = self.linear(output_unpacked)
        return x

class BiLSTM_Tagger_B(nn.Module):
    '''
    This class is created mostly by using the reference:
    https://galhever.medium.com/sentiment-analysis-with-pytorch-part-4-lstm-bilstm-model-84447f6c4525
    '''

    def __init__(self, char_vocab_size, char_embedding_dim, pad_index, char_lstm_units, max_chars_in_word, lstm_layers, lstm_units, num_classes):
        super(BiLSTM_Tagger_B, self).__init__()

        self.embedding = nn.Embedding(char_vocab_size, char_embedding_dim, padding_idx=pad_index)
        self.chars_lstm = nn.LSTM(char_embedding_dim, char_lstm_units, batch_first=True)

        self.lstm = nn.LSTM(char_lstm_units * max_chars_in_word,
                            lstm_units,
                            num_layers=lstm_layers,
                            bidirectional=True,
                            batch_first=True)

        self.linear = nn.Linear(lstm_units * 2, num_classes) # multiple lstm output in 2 for two directions. lstm output is the input to the linear layer

    def forward(self, chars, text_lengths):
        batch_size, sentence_length, chars_length = chars.shape

        # Step #1: transform chars => embeddings.
        # Input size: batch_size X max_sentence_length X chars_max_length (e.g. 50 X 141 X 54)
        # Output size: batch_size X max_sentence_length X chars_max_length X chars_embedding_length (e.g.50 X 141 X 54 X 12)

        embedded = self.embedding(chars)

        # Step #2: go throught char LSTM.
        # Input size: batch_size X max_sentence_length X chars_max_length X chars_embedding_length (e.g.50 X 141 X 54 X 12)
        # Output size: We need to stack all chars (one on top on the other). Therefore the dim is:
        # (batch_size*max_sentence_length*chars_max_length) X 1 X chars_embedding_length (e.g. 380700 X 1 X 50)

        x = embedded.view(-1, 1, self.embedding.embedding_dim)
        output, (h_n, c_n) = self.chars_lstm(x)

        # Step #3: convert chars back to sentences
        # Input size: (batch_size*max_sentence_length*chars_max_length) X 1 X chars_embedding_length (e.g. 380700 X 1 X 50)
        # Output size: batch_size X max_sentence_length X words' chars-representing embeddings (e.g. 50 X 141 X 2700)
        x = output.view(batch_size, sentence_length, -1)

        ########################### From now on - just like in tagger A ###########################

        # Here, input size: batch_size X max_sentence_length X words' chars-representing embeddings (e.g. 50 X 141 X 2700)
        packed_embedded = pack_padded_sequence(x, text_lengths, batch_first=True)

        output, (h_n, c_n) = self.lstm(packed_embedded)

        output_unpacked, output_lengths = pad_packed_sequence(output, batch_first=True)

        x = self.linear(output_unpacked)
        return x

class BiLSTM_Tagger_C(nn.Module):
    '''
    This class is created mostly by using the reference:
    https://galhever.medium.com/sentiment-analysis-with-pytorch-part-4-lstm-bilstm-model-84447f6c4525
    '''

    def __init__(self, vocab_size, prefix_vocab_size, suffix_vocab_size, embedding_dim, pad_index, lstm_layers, lstm_units, num_classes):
        super(BiLSTM_Tagger_C, self).__init__()

        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=pad_index)
        self.prefix_embeddings = nn.Embedding(prefix_vocab_size, embedding_dim, padding_idx=pad_index)
        self.suffix_embeddings = nn.Embedding(suffix_vocab_size, embedding_dim, padding_idx=pad_index)

        self.lstm = nn.LSTM(embedding_dim,
                            lstm_units,
                            num_layers=lstm_layers,
                            bidirectional=True,
                            batch_first=True)

        self.linear = nn.Linear(lstm_units * 2, num_classes) # multiple lstm output in 2 for two directions. lstm output is the input to the linear layer

    def forward(self, text, text_prefix, text_suffix, text_lengths):
        embedded = self.prefix_embeddings(text_prefix) + \
              self.embedding(text) + \
              self.suffix_embeddings(text_suffix)
        packed_embedded = pack_padded_sequence(embedded, text_lengths, batch_first=True)

        output, (h_n, c_n) = self.lstm(packed_embedded)

        output_unpacked, output_lengths = pad_packed_sequence(output, batch_first=True)

        x = self.linear(output_unpacked)
        return x

class BiLSTM_Tagger_D(nn.Module):
    def __init__(self, vocab_size, word_embedding_dim, char_vocab_size, char_embedding_dim, pad_index, char_lstm_units, max_chars_in_word, lstm_layers, lstm_units, num_classes):
        super(BiLSTM_Tagger_D, self).__init__()
        self.words_embedding = nn.Embedding(vocab_size, word_embedding_dim, padding_idx=pad_index)

        self.chars_embedding = nn.Embedding(char_vocab_size, char_embedding_dim, padding_idx=pad_index)
        self.chars_lstm = nn.LSTM(char_embedding_dim, char_lstm_units, batch_first=True)

        self.lstm = nn.LSTM(word_embedding_dim + char_lstm_units * max_chars_in_word,
                            lstm_units,
                            num_layers=lstm_layers,
                            bidirectional=True,
                            batch_first=True)

        self.linear = nn.Linear(lstm_units * 2, num_classes)

    def forward(self, text, chars, text_lengths):
        # handling chars embedding
        batch_size, sentence_length, chars_length = chars.shape

        embedded = self.chars_embedding(chars)
        chars_input = embedded.view(-1, 1, self.chars_embedding.embedding_dim)
        output, (h_n, c_n) = self.chars_lstm(chars_input)
        chars_repr = output.view(batch_size, sentence_length, -1)

        # handling word embaddings
        words_repr = self.words_embedding(text)

        # now - concat
        input = torch.cat((words_repr, chars_repr), -1)

        ############## The rest - as brefore ##############
        packed_embedded = pack_padded_sequence(input, text_lengths, batch_first=True)

        output, (h_n, c_n) = self.lstm(packed_embedded)
        output_unpacked, output_lengths = pad_packed_sequence(output, batch_first=True)

        chars_repr = self.linear(output_unpacked)
        return chars_repr