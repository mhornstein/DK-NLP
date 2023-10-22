import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss', '../app.component.scss']
})
export class HistoryComponent {
  historyData: any = [
    {id: 1, date: '2014-03-12T13:37:27+00:00', tagged_sentence: [["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"],["1","hello"],["2","word"],["3","!"]]},
    {id: 2, date: '2023-03-12T13:37:27+00:00', tagged_sentence: [["5","bye"],["7","bili"]]}
  ];
  tagType: string = 'pos'; // Default value

}
