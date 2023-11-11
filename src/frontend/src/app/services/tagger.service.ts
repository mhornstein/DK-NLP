import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaggerService {
  constructor(private http: HttpClient) {}

  tagText(inputText: string, tagType: string): Observable<[string, string][]> {
    const url = `http://${
      environment.serverUri
    }/tag?mode=${tagType}&sentence=${encodeURIComponent(inputText)}`;
    return this.http.get<[string, string][]>(url);
  }
}
