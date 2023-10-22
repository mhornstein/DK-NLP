import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss', '../app.component.scss']
})
export class HistoryComponent {
  historyData: any[][] = [[["1","hello"],["2","word"],["3","!"]],
  [["5","bye"],["7","bili"]]];
  tagType: string = 'pos'; // Default value

}
