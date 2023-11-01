import { Component } from '@angular/core';
import { TaggerService } from '../services/tagger.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.scss', '../app.component.scss']
})
export class TaggerComponent {
  inputText = '';
  tagType = 'pos'; // Default value
  taggedWords: [string, string][] = [];

  constructor(private taggerService: TaggerService, private errorHandlerService: ErrorHandlerService) {}

  tagText() {
    this.taggerService.tagText(this.inputText, this.tagType)
      .subscribe({
        next: (result: [string, string][]) => {
          this.taggedWords = result;
        },
        error: (err) => {
          if (err.status == 503) {
            console.warn(`The sentence was processed but not logged. Error information:\n${err.error.details}`)
            this.taggedWords = err.error.tagged_sentence;
          } else {
            console.error('Error while tagging text:', err);
            this.errorHandlerService.handle(err);
          }
        }
      });
  }
}
