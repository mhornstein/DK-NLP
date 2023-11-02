import { ErrorHandlerService } from './error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  SERVER_UNAVAILABLE,
  CHECK_SERVER_CONNECTION,
  UNKNOWN_ERROR,
} from '../shared/error-constants';

describe('ErrorHandlerService', () => {
  let errorHandlerService: ErrorHandlerService;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const dialogRefMock = {
      componentInstance: {
        closeEvent: of(),
      },
    };

    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefMock);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });
    errorHandlerService = TestBed.inject(ErrorHandlerService);
    dialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(errorHandlerService).toBeTruthy();
  });

  describe('handle', () => {
    it('should open the error dialog for server unavailable error', () => {
      const error = { status: 0, message: 'Server not responding' };
      errorHandlerService.handle(error);
      expect(dialogMock.open).toHaveBeenCalledWith(ErrorComponent, {
        data: {
          header: SERVER_UNAVAILABLE,
          body: `${CHECK_SERVER_CONNECTION}. Details: ${error.message}`,
        },
        width: 'auto',
        maxHeight: 'none',
        position: { top: '100px' },
      });
    });

    it('should open the error dialog for an error with error and details properties', () => {
      const error = {
        error: { error: 'Custom Error', details: 'Error details' },
      };
      errorHandlerService.handle(error);
      expect(dialogMock.open).toHaveBeenCalledWith(ErrorComponent, {
        data: { header: error.error.error, body: error.error.details },
        width: 'auto',
        maxHeight: 'none',
        position: { top: '100px' },
      });
    });

    it('should open the error dialog for an unknown error', () => {
      const error = { someUnknownProperty: 'Some unknown Error details' };
      errorHandlerService.handle(error);
      expect(dialogMock.open).toHaveBeenCalledWith(ErrorComponent, {
        data: {
          header: UNKNOWN_ERROR,
          body: `Error details: ${JSON.stringify(error)}`,
        },
        width: 'auto',
        maxHeight: 'none',
        position: { top: '100px' },
      });
    });
  });

  describe('openErrorDialog', () => {
    it('should open the error dialog with the provided header and body', () => {
      const header = 'Custom Header';
      const body = 'Custom Body';
      errorHandlerService.openErrorDialog(header, body);
      expect(dialogMock.open).toHaveBeenCalledWith(ErrorComponent, {
        data: { header, body },
        width: 'auto',
        maxHeight: 'none',
        position: { top: '100px' },
      });
    });
  });
});
