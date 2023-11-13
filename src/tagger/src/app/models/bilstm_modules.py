import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence


class BiLSTM_Tagger_C(nn.Module):
    """
    This class is created mostly by using the reference:
    https://galhever.medium.com/sentiment-analysis-with-pytorch-part-4-lstm-bilstm-model-84447f6c4525
    """

    def __init__(
        self,
        vocab_size,
        prefix_vocab_size,
        suffix_vocab_size,
        embedding_dim,
        pad_index,
        lstm_layers,
        lstm_units,
        num_classes,
    ):
        super(BiLSTM_Tagger_C, self).__init__()

        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=pad_index)
        self.prefix_embeddings = nn.Embedding(prefix_vocab_size, embedding_dim, padding_idx=pad_index)
        self.suffix_embeddings = nn.Embedding(suffix_vocab_size, embedding_dim, padding_idx=pad_index)

        self.lstm = nn.LSTM(
            embedding_dim,
            lstm_units,
            num_layers=lstm_layers,
            bidirectional=True,
            batch_first=True,
        )

        self.linear = nn.Linear(
            lstm_units * 2, num_classes
        )  # multiple lstm output in 2 for two directions. lstm output is the input to the linear layer

    def forward(self, text, text_prefix, text_suffix, text_lengths):
        embedded = (
            self.prefix_embeddings(text_prefix) + self.embedding(text) + self.suffix_embeddings(text_suffix)
        )
        packed_embedded = pack_padded_sequence(embedded, text_lengths, batch_first=True)

        output, _ = self.lstm(packed_embedded)

        output_unpacked, _ = pad_packed_sequence(output, batch_first=True)

        x = self.linear(output_unpacked)
        return x
