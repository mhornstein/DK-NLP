import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() header: string = '';
  @Input() body: string = '';
  @Output() close = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<ErrorComponent>) {}

  closeError() {
    this.close.emit();
    this.dialogRef.close(); // Close the dialog
  }
}
