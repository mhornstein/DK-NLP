import { Component } from '@angular/core';

@Component({
  selector: 'app-pos-tagger',
  templateUrl: './pos-tagger.component.html',
  styleUrls: ['./pos-tagger.component.scss']
})
export class PosTaggerComponent {
  inputText: string = '';
  taggedWords: string[] = [];

  tagText() {
    // Split the input text into words
    const words = this.inputText.split(' ');

    // Add "wow" above each word
    this.taggedWords = words.map(word => `${word}`);
  }
}
