import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TaggerComponent } from './tagger.component';
import { TaggerService } from '../services/tagger.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { of, throwError } from 'rxjs';

describe('TaggerComponent', () => {
  let component: TaggerComponent;
  let fixture: ComponentFixture<TaggerComponent>;
  let taggerService: jasmine.SpyObj<TaggerService>;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaggerComponent],
      providers: [
        {
          provide: TaggerService,
          useValue: jasmine.createSpyObj('TaggerService', ['tagText']),
        },
        {
          provide: ErrorHandlerService,
          useValue: jasmine.createSpyObj('ErrorHandlerService', ['handle']),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggerComponent);
    component = fixture.componentInstance;
    taggerService = TestBed.inject(
      TaggerService,
    ) as jasmine.SpyObj<TaggerService>;
    errorHandlerService = TestBed.inject(
      ErrorHandlerService,
    ) as jasmine.SpyObj<ErrorHandlerService>;
  });

  it('should set taggedWords correctly when tagText is called correctly', () => {
    const inputText = 'word1 word2';
    const result: [string, string][] = [
      ['word1', 'tag1'],
      ['word2', 'tag2'],
    ];
    taggerService.tagText.and.returnValue(of(result));

    component.inputText = inputText;
    component.tagText();

    expect(component.taggedWords).toEqual(result);
  });

  it('should set taggedWords correctly and log an error message when status 503 occurs', () => {
    const consoleErrorSpy = spyOn(console, 'warn');
    const inputText = 'word1 word2';
    const result: [string, string][] = [
      ['word1', 'tag1'],
      ['word2', 'tag2'],
    ];
    const errorResponse = {
      status: 503,
      error: {
        details: 'Error details',
        tagged_sentence: result,
      },
    };

    taggerService.tagText.and.returnValue(throwError(errorResponse));

    component.inputText = inputText;
    component.tagText();

    expect(component.taggedWords).toEqual(result);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `The sentence was processed but not logged. Error information:\n${errorResponse.error.details}`,
    );
  });

  it('should log and handle an unknown error', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const errorResponse = {
      status: 500, // Simulating an unknown error with status 500
      error: {
        details: 'Unknown error occurred',
      },
    };

    errorHandlerService.handle.and.stub();

    taggerService.tagText.and.returnValue(throwError(errorResponse));

    component.inputText = 'word1 word2';
    component.tagText();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error while tagging text:',
      errorResponse,
    );
    expect(errorHandlerService.handle).toHaveBeenCalledWith(errorResponse);
  });
});
