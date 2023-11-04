import { Component, OnInit } from '@angular/core';
import { HistoryData } from '../shared/history-data';
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
  historyDataDict: { [key: string]: HistoryData[] } = {
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
    const historyData = this.historyDataDict[this.tagType];
    if (!this.buttonDisabled[this.tagType] && historyData.length === 0) {
      // If historyData is empty, call fetchHistory with just tagType
      this.fetchHistory(historyData, this.tagType).subscribe(
        (history_added) => {
          if (!history_added) {
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
    const historyData = this.historyDataDict[this.tagType];
    if (historyData.length == 0) {
      console.error(EMPTY_HISTORY_RELOAD_ERROR_MSG);
      return;
    }
    const lastItem = historyData[historyData.length - 1];
    const lastId = lastItem._id;
    this.fetchHistory(historyData, this.tagType, lastId).subscribe(
      (history_added) => {
        if (!history_added) {
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
    historyData: HistoryData[],
    tagType: string,
    lastId?: string,
  ): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.historyService.fetchHistory(tagType, lastId).subscribe({
        next: (data: HistoryData[]) => {
          if (data.length > 0) {
            historyData.push(...data);
            observer.next(true); // Data was fetched successfully
          } else {
            observer.next(false); // No data was fetched
          }
          observer.complete();
        },
        error: (error) => {
          this.errorService.handle(error);
        },
      });
    });
  }
}
