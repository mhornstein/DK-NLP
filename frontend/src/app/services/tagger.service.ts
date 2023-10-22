import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class TaggerService {
  constructor(private dbService: DbService) {}

  tagText(inputText: string, tagType: string): [string, string][] {
    debugger
    const words = inputText.split(' ');
    const results: [string, string][] = words.map((word, index) => [(index + 1).toString(), word]);
    this.dbService.addToDatabase(results);
    return results;
  }  
}
