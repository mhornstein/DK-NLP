import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  header = '';
  body = '';
  @Output() closeEvent = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<ErrorComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.header = data.header;
    this.body = data.body;
  }

  closeError() {
    this.closeEvent.emit();
    this.dialogRef.close(); // Close the dialog
  }
}
