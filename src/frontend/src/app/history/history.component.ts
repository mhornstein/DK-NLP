import { Component, OnInit } from '@angular/core';
import { EntryData, HistoryData } from '../shared/history-data';
import { HistoryService } from '../services/history.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observable } from 'rxjs';
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
      this.fetchHistory(entriesData, this.tagType).subscribe(
        (end_of_history) => {
          if (end_of_history) {
            this.buttonDisabled[this.tagType] = true;
          }
        },
      );
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
    this.fetchHistory(entriesData, this.tagType, lastId).subscribe(
      (end_of_history) => {
        if (end_of_history) {
          this.buttonDisabled[this.tagType] = true;
          this.errorService.openErrorDialog(
            END_OF_TAGGING_HISTORY,
            NO_MORE_HISTORY_FOUND_MSG,
          );
        }
      },
    );
  }

  private fetchHistory(
    entriesData: EntryData[],
    tagType: string,
    lastId?: string,
  ): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.historyService.fetchHistory(tagType, lastId).subscribe({
        next: (historyData: HistoryData) => {
          entriesData.push(...historyData.entries);
          observer.next(historyData.end_of_history);
          observer.complete();
        },
        error: (error) => {
          this.errorService.handle(error);
        },
      });
    });
  }
}
