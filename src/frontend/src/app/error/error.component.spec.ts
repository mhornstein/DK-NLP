import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let dialogRefMock: { close: jasmine.Spy };
  const header = 'Test Header';
  const body = 'Test Body';

  beforeEach(() => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { header, body } },
      ],
    });

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set header and body from MAT_DIALOG_DATA', () => {
    expect(component.header).toEqual(header);
    expect(component.body).toEqual(body);
  });

  it('should emit closeEvent and close the dialog when closeError is called', () => {
    const closeEventSpy = spyOn(component.closeEvent, 'emit');

    component.closeError();

    expect(closeEventSpy).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
