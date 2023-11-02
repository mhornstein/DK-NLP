import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaggerService } from './tagger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

describe('TaggerService', () => {
  let service: TaggerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaggerService],
    });

    service = TestBed.inject(TaggerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should tag text with the specified tag type', () => {
    const inputText = 'Hello world';
    const tagType = 'pos';
    const expectedData: [string, string][] = [
      ['Hello,', 'NN'],
      ['world', 'NN'],
    ];

    service.tagText(inputText, tagType).subscribe((data) => {
      expect(data).toEqual(expectedData);
    });

    const req = httpTestingController.expectOne((req) => {
      return (
        req.url ===
        `http://127.0.0.1:3000/tag?mode=${tagType}&sentence=${encodeURIComponent(
          inputText,
        )}`
      );
    });

    expect(req.request.method).toEqual('GET');

    req.flush(expectedData);
  });

  it('should handle API error', () => {
    const inputText = 'Hello world';
    const tagType = 'pos';
    const errorText = 'Internal Server Error';

    service
      .tagText(inputText, tagType)
      .pipe(
        catchError((error) => {
          expect(error).toBeDefined();
          expect(error instanceof HttpErrorResponse).toBe(true);
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorText);
          return []; // Provide a default value or re-throw the error if needed
        }),
      )
      .subscribe((data) => {
        // This should not be called in case of an error
        expect(true).toBe(false);
        return data;
      });

    const req = httpTestingController.expectOne((req) => {
      return (
        req.url ===
        `http://127.0.0.1:3000/tag?mode=${tagType}&sentence=${encodeURIComponent(
          inputText,
        )}`
      );
    });

    expect(req.request.method).toEqual('GET');

    // Simulate an API error response
    req.flush(null, { status: 500, statusText: errorText });
  });
});
