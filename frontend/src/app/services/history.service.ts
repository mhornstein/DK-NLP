import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryData } from '../shared/history-data';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  fetchHistory(tagType: string, last_id?: string): Observable<HistoryData[]> {
    let url = '';
    if (last_id == undefined) {
      url = `http://127.0.0.1:3000/fetch_entries?mode=${tagType}`;
    } else {
      url = `http://127.0.0.1:3000/fetch_entries?mode=${tagType}&entry_id=${last_id}`;
    }
    return this.http.get<HistoryData[]>(url);
  }
}
