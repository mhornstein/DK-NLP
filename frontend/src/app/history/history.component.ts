import { Component, OnInit } from '@angular/core';
import { EntryData, HistoryData } from '../shared/history-data';
import { HistoryService } from '../services/history.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import {
  BUTTON_DISABLED_NO_HISTORY_ERROR_MSG,
  EMPTY_HISTORY_RELOAD_ERROR_MSG,
  END_OF_TAGGING_HISTORY,
  NO_MORE_HISTORY_FOUND_MSG,
} from '../shared/error-constants';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss', '../app.component.scss'],
})
export class HistoryComponent implements OnInit {
  entriesDataDict: { [key: string]: EntryData[] } = {
    pos: [],
    ner: [],
  };
  buttonDisabled: { [key: string]: boolean } = {
    pos: false,
    ner: false,
  };
  tagType = 'pos'; // Default value

  constructor(
    private historyService: HistoryService,
    private errorService: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const entriesData = this.entriesDataDict[this.tagType];
    if (!this.buttonDisabled[this.tagType] && entriesData.length === 0) {
      this.historyService.fetchHistory(this.tagType).subscribe({
        next: (historyData: HistoryData) => {
          entriesData.push(...historyData.entries);
          if (historyData.end_of_history) {
            this.buttonDisabled[this.tagType] = true;
          }
        },
        error: (error) => {
          this.errorService.handle(error);
        },
      });
    }
  }

  reloadHistory() {
    if (this.buttonDisabled[this.tagType] == true) {
      console.error(BUTTON_DISABLED_NO_HISTORY_ERROR_MSG);
      return;
    }
    const entriesData = this.entriesDataDict[this.tagType];
    if (entriesData.length == 0) {
      console.error(EMPTY_HISTORY_RELOAD_ERROR_MSG);
      return;
    }
    const lastItem = entriesData[entriesData.length - 1];
    const lastId = lastItem._id;

    this.historyService.fetchHistory(this.tagType, lastId).subscribe({
      next: (historyData: HistoryData) => {
        entriesData.push(...historyData.entries);
        if (historyData.end_of_history) {
          this.buttonDisabled[this.tagType] = true;
          this.errorService.openErrorDialog(
            END_OF_TAGGING_HISTORY,
            NO_MORE_HISTORY_FOUND_MSG,
          );
        }
      },
      error: (error) => {
        this.errorService.handle(error);
      },
    });
  }
}
