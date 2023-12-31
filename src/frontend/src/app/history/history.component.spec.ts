import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HistoryService } from '../services/history.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import {
  BUTTON_DISABLED_NO_HISTORY_ERROR_MSG,
  END_OF_TAGGING_HISTORY,
  NO_MORE_HISTORY_FOUND_MSG,
  EMPTY_HISTORY_RELOAD_ERROR_MSG,
} from '../shared/error-constants';
import { HistoryData, EntryData } from '../shared/history-data';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historyService: jasmine.SpyObj<HistoryService>;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;
  const mockEntriesList: EntryData[] = [
    {
      _id: '1',
      date: '2023-11-03',
      tagged_sentence: [
        ['word1', 'tag1'],
        ['word2', 'tag2'],
      ],
    },
    {
      _id: '2',
      date: '2023-11-04',
      tagged_sentence: [
        ['word3', 'tag3'],
        ['word4', 'tag4'],
      ],
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HistoryService,
          useValue: jasmine.createSpyObj('HistoryService', ['fetchHistory']),
        },
        {
          provide: ErrorHandlerService,
          useValue: jasmine.createSpyObj('ErrorHandlerService', [
            'handle',
            'openErrorDialog',
          ]),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    historyService = TestBed.inject(
      HistoryService,
    ) as jasmine.SpyObj<HistoryService>;
    errorHandlerService = TestBed.inject(
      ErrorHandlerService,
    ) as jasmine.SpyObj<ErrorHandlerService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadHistory on ngOnInit', () => {
    const loadHistorySpy = spyOn(component, 'loadHistory');
    component.ngOnInit();
    expect(loadHistorySpy).toHaveBeenCalled();
  });

  // loadHistory tests

  it('should not call fetchHistory when button is disabled', () => {
    component.buttonDisabled[component.tagType] = true;
    const fetchHistorySpy = spyOn(component as any, 'fetchHistory');
    component.loadHistory();
    expect(fetchHistorySpy).not.toHaveBeenCalled();
  });

  it('should not call fetchHistory when historyData length is not 0', () => {
    component.buttonDisabled[component.tagType] = false;
    component.entriesDataDict[component.tagType] = mockEntriesList;
    const fetchHistorySpy = spyOn(component as any, 'fetchHistory');
    component.loadHistory();
    expect(fetchHistorySpy).not.toHaveBeenCalled();
  });

  it('should set buttonDisabled to true when fetchHistory returns true', fakeAsync(() => {
    const fetchHistorySpy = spyOn(component as any, 'fetchHistory');
    fetchHistorySpy.and.returnValue(of(true));
    component.loadHistory();
    expect(fetchHistorySpy).toHaveBeenCalled();
    expect(component.buttonDisabled[component.tagType]).toBe(true);
  }));

  it('should keep buttonDisabled false when fetchHistory returns false', fakeAsync(() => {
    const fetchHistorySpy = spyOn(component as any, 'fetchHistory');
    fetchHistorySpy.and.returnValue(of(false));
    component.loadHistory();
    expect(fetchHistorySpy).toHaveBeenCalled();
    expect(component.buttonDisabled[component.tagType]).toBe(false); // button disabling remains false
  }));

  // reloadHistory tests

  it('should not call fetchHistory and log BUTTON_DISABLED_NO_HISTORY_ERROR_MSG when the button is disabled', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    component.buttonDisabled[component.tagType] = true;

    const fetchHistorySpy = spyOn(component as any, 'fetchHistory');

    component.reloadHistory();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      BUTTON_DISABLED_NO_HISTORY_ERROR_MSG,
    );
    expect(fetchHistorySpy).not.toHaveBeenCalled();
  });

  it('should not call fetchHistory and log EMPTY_HISTORY_RELOAD_ERROR_MSG when the button is enabled but the history is empty', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    component.buttonDisabled[component.tagType] = false;

    const fetchHistorySpy = spyOn(component as any, 'fetchHistory');

    component.reloadHistory();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      EMPTY_HISTORY_RELOAD_ERROR_MSG,
    );
    expect(fetchHistorySpy).not.toHaveBeenCalled();
  });

  it('should call fetchHistory with the appropriate arguments when the button is not disabled and historyData is not empty, and do nothing when fetchHistory returns false', () => {
    component.buttonDisabled[component.tagType] = false;
    component.entriesDataDict[component.tagType] = mockEntriesList;
    const lastId = mockEntriesList[mockEntriesList.length - 1]._id;
    const fetchHistorySpy = spyOn(
      component as any,
      'fetchHistory',
    ).and.returnValue(of(false));

    component.reloadHistory();

    expect(fetchHistorySpy).toHaveBeenCalledWith(
      mockEntriesList,
      component.tagType,
      lastId,
    );
    expect(component.buttonDisabled[component.tagType]).toBe(false);
    expect(errorHandlerService.openErrorDialog).not.toHaveBeenCalled();
  });

  it('should call fetchHistory with the appropriate arguments when the button is not disabled and historyData is not empty, and disable the button + display a pop-up when fetchHistory returns true', () => {
    component.buttonDisabled[component.tagType] = false;
    component.entriesDataDict[component.tagType] = mockEntriesList;
    const lastId = mockEntriesList[mockEntriesList.length - 1]._id;

    const fetchHistorySpy = spyOn(
      component as any,
      'fetchHistory',
    ).and.returnValue(of(true));

    component.reloadHistory();

    // Expectations
    expect(fetchHistorySpy).toHaveBeenCalledWith(
      mockEntriesList,
      component.tagType,
      lastId,
    );
    expect(component.buttonDisabled[component.tagType]).toBe(true); // Ensure buttonDisabled is set to true
    expect(errorHandlerService.openErrorDialog).toHaveBeenCalledWith(
      END_OF_TAGGING_HISTORY,
      NO_MORE_HISTORY_FOUND_MSG,
    );
  });

  // fetchHistory tests

  it('should return false when end_of_history is false', fakeAsync(() => {
    const mockHistoryData: HistoryData = {
      entries: [],
      end_of_history: false,
    };
    historyService.fetchHistory.and.returnValue(of(mockHistoryData));

    const observer = (component as any).fetchHistory([], component.tagType);

    let result: boolean | undefined;
    observer.subscribe((value: boolean) => {
      result = value;
    });

    tick();

    expect(result).toBe(false);
  }));

  it('should return true when end_of_history is true', fakeAsync(() => {
    const mockHistoryData: HistoryData = {
      entries: [],
      end_of_history: true,
    };
    historyService.fetchHistory.and.returnValue(of(mockHistoryData));

    const observer = (component as any).fetchHistory([], component.tagType);

    let result: boolean | undefined;
    observer.subscribe((value: boolean) => {
      result = value;
    });

    tick();

    expect(result).toBe(true);
  }));

  it('should call errorService.handle when historyService.fetchHistory returns an error', fakeAsync(() => {
    const testError = new Error('Test error');
    historyService.fetchHistory.and.returnValue(throwError(testError));

    const observer = (component as any).fetchHistory([], component.tagType);

    let result: boolean | undefined;
    observer.subscribe({
      next: (value: boolean) => {
        result = value;
      },
      error: (error: any) => {
        expect(error).toBe(testError);
      },
    });

    expect(result).toBeUndefined();
    expect(historyService.fetchHistory).toHaveBeenCalledOnceWith(
      component.tagType,
      undefined,
    );
    expect(errorHandlerService.handle).toHaveBeenCalledWith(testError);
  }));
});
