import { Component } from '@angular/core';
import { TaggerService } from '../services/tagger.service';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.scss', '../app.component.scss']
})
export class TaggerComponent {
  inputText: string = '';
  tagType: string = 'pos'; // Default value
  taggedWords: [string, string][] = [];

  constructor(private taggerService: TaggerService) {}

  tagText() {
    this.taggerService.tagText(this.inputText, this.tagType)
      .subscribe({
        next: (result: [string, string][]) => {
          this.taggedWords = result;
        },
        error: (error) => {
          console.error('Error while tagging text:', error);
          // Handle error as needed
        }
      });
  }
}
