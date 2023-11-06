import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HistoryService } from './history.service';
// import { HistoryData } from '../shared/history-data';
import { HttpErrorResponse } from '@angular/common/http';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HistoryService],
    });
    historyService = TestBed.inject(HistoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(historyService).toBeTruthy();
  });

  /*
  it('should fetch history successfully when last_id defined', () => {
    const tagType = 'someType';
    const lastId = 'someId';
    const mockData: HistoryData[] = [
      {
        _id: '1',
        date: '2023-11-02',
        tagged_sentence: [
          ['tag1', 'word1'],
          ['tag2', 'word2'],
        ],
      },
      {
        _id: '2',
        date: '2023-11-03',
        tagged_sentence: [
          ['tag3', 'word3'],
          ['tag4', 'word4'],
        ],
      },
    ];

    historyService.fetchHistory(tagType, lastId).subscribe((data) => {
      expect(data).toEqual(mockData); // Validate that the mock data is returned
    });

    const req = httpTestingController.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url ===
          `http://127.0.0.1:3000/fetch_entries?mode=${tagType}&entry_id=${lastId}`
      );
    });

    req.flush(mockData); // Mock response with the defined data
  });

  it('should fetch history successfully when last_id undefined', () => {
    const tagType = 'someType';
    const mockData: HistoryData[] = [
      {
        _id: '1',
        date: '2023-11-02',
        tagged_sentence: [
          ['tag1', 'word1'],
          ['tag2', 'word2'],
        ],
      },
      {
        _id: '2',
        date: '2023-11-03',
        tagged_sentence: [
          ['tag3', 'word3'],
          ['tag4', 'word4'],
        ],
      },
    ];

    historyService.fetchHistory(tagType).subscribe((data) => {
      expect(data).toEqual(mockData); // Validate that the mock data is returned
    });

    const req = httpTestingController.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url === `http://127.0.0.1:3000/fetch_entries?mode=${tagType}`
      );
    });

    req.flush(mockData); // Mock response with the defined data
  });

  */
  it('should handle API error', () => {
    const tagType = 'someType';
    const lastId = 'someId';
    const errorText = 'Internal Server Error';

    historyService.fetchHistory(tagType, lastId).subscribe(
      () => {
        fail('Expected error, but got a success response');
      },
      (error) => {
        expect(error).toBeDefined();
        expect(error instanceof HttpErrorResponse).toBe(true);
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorText);
        return []; // Provide a default value or re-throw the error if needed
      },
    );

    const req = httpTestingController.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url ===
          `http://127.0.0.1:3000/fetch_entries?mode=${tagType}&entry_id=${lastId}`
      );
    });

    // Simulate an API error by providing an error response
    req.flush(null, { status: 500, statusText: errorText });
  });
});
