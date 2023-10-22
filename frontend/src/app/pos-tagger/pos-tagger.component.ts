import { Component } from '@angular/core';
import { TaggerService } from '../services/tagger.service';

@Component({
  selector: 'app-pos-tagger',
  templateUrl: './pos-tagger.component.html',
  styleUrls: ['./pos-tagger.component.scss']
})
export class PosTaggerComponent {
  inputText: string = '';
  tagType: string = 'pos'; // Default value
  
  taggedWords: [string, string][] = [];

  constructor(private taggerService: TaggerService) {}

  tagText() {
    this.taggedWords = this.taggerService.tagText(this.inputText, this.tagType);
  }
}
