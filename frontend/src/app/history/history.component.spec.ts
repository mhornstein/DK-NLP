import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HistoryService } from '../services/history.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historyService: HistoryService;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HistoryService, useValue: jasmine.createSpyObj('HistoryService', ['fetchHistory']) },
        { provide: ErrorHandlerService, useValue: jasmine.createSpyObj('ErrorHandlerService', ['handle']) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    historyService = TestBed.inject(HistoryService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
