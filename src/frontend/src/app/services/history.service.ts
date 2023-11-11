import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryData } from '../shared/history-data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  fetchHistory(tagType: string, lastId?: string): Observable<HistoryData> {
    let url = '';
    if (lastId == undefined) {
      url = `http://${environment.serverUri}/fetch_entries?mode=${tagType}`;
    } else {
      url = `http://${environment.serverUri}/fetch_entries?mode=${tagType}&entry_id=${lastId}`;
    }
    return this.http.get<HistoryData>(url);
  }
}
