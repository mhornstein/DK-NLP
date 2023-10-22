import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaggerService {
  tagText(inputText: string): string[] {
    const words = inputText.split(' ');
    return words.map(word => `wow ${word}`);
  }
}
