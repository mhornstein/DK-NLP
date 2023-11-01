import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaggerService {
  constructor(private http: HttpClient) {}

  tagText(inputText: string, tagType: string): Observable<[string, string][]> {
    const url = `http://127.0.0.1:3000/tag?mode=${tagType}&sentence=${encodeURIComponent(
      inputText,
    )}`;
    return this.http.get<[string, string][]>(url);
  }
}
