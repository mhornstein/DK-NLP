import { Component } from '@angular/core';
import { TaggerService } from '../services/tagger.service';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.scss']
})
export class TaggerComponent {
  inputText: string = '';
  tagType: string = 'pos'; // Default value
  
  taggedWords: [string, string][] = [];

  constructor(private taggerService: TaggerService) {}

  tagText() {
    this.taggedWords = this.taggerService.tagText(this.inputText, this.tagType);
  }
}
