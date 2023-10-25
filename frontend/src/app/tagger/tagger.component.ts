import { Component } from '@angular/core';
import { TaggerService } from '../services/tagger.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.scss', '../app.component.scss']
})
export class TaggerComponent {
  inputText: string = '';
  tagType: string = 'pos'; // Default value
  taggedWords: [string, string][] = [];

  constructor(private taggerService: TaggerService, private errorHandlerService: ErrorHandlerService) {}

  tagText() {
    this.taggerService.tagText(this.inputText, this.tagType)
      .subscribe({
        next: (result: [string, string][]) => {
          this.taggedWords = result;
        },
        error: (err) => {
          console.error('Error while tagging text:', err);
          this.errorHandlerService.handle(err.error.error, err.error.details);
        }
      });
  }
}
