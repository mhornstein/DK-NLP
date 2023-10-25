import { Component } from '@angular/core';
import { HistoryData } from '../shared/history-data';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss', '../app.component.scss']
})
export class HistoryComponent {
  historyDataDict: { [key: string]: HistoryData[] } = {
    pos: [],
    ner: [],
  };
  tagType: string = 'pos'; // Default value

  constructor(private historyService: HistoryService) {}
  
  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    debugger
    const historyData = this.historyDataDict[this.tagType];
    if (historyData.length === 0) { // If historyData is empty, call fetchHistory with just tagType
      this.fetchHistory(historyData, this.tagType);
    } else { // If historyData is not empty, get the last_id and call fetchHistory with both tagType and last_id - TODO: move it to loading button functionality
      const lastItem = historyData[historyData.length - 1];
      const lastId = lastItem._id;
      this.fetchHistory(historyData, this.tagType, lastId);
    }
  }

  private fetchHistory(historyData: HistoryData[], tagType: string, lastId?: string): void {
    this.historyService.fetchHistory(tagType, lastId).subscribe((data: HistoryData[]) => {
      debugger
      historyData.push(...data);
    });
  }

}
