import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaggerService {
  tagText(inputText: string, tagType: string): [string, string][] {
    const words = inputText.split(' ');
    return words.map((word, index) => [(index + 1).toString(), word]);
  }  
}
