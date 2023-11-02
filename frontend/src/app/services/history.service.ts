import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryData } from '../shared/history-data';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  fetchHistory(tagType: string, lastId?: string): Observable<HistoryData[]> {
    let url = '';
    if (lastId == undefined) {
      url = `http://127.0.0.1:3000/fetch_entries?mode=${tagType}`;
    } else {
      url = `http://127.0.0.1:3000/fetch_entries?mode=${tagType}&entry_id=${lastId}`;
    }
    return this.http.get<HistoryData[]>(url);
  }
}
