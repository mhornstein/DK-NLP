import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private dialog: MatDialog) {}

  handle(header: string, body: string) {
    this.openErrorDialog(header, body);
  }

  private openErrorDialog(header: string, body: string) {
    const dialogRef = this.dialog.open(ErrorComponent, {
      data: {
        header: header,
        body: body
      },
      width: 'auto', // Set width to 'auto' to fit content
      maxHeight: 'none', // Remove maxHeight to fit content
      position: {
        top: '100px' // Adjust the top value to move the dialog down
      }
    });    

    dialogRef.componentInstance.close.subscribe(() => {
      dialogRef.close();
    });
  }
}
