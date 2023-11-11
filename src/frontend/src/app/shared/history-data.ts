export interface HistoryData {
  end_of_history: boolean;
  entries: EntryData[];
}

export interface EntryData {
  _id: string;
  date: string;
  tagged_sentence: [string, string][];
}
