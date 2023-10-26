import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private dialog: MatDialog) {}

  handle(err: any) {
    debugger
    let header = '', body = '';
    if (err.status === 0 || err.status === 503) { // server not responding
      header = 'Server Unavailable'
      body = `Please check the server connection. Details: ${err.message}`;
    } else {
      header = err.error.error;
      body = err.error.details;
    }
    this.openErrorDialog(header, body);   
  }

  public openErrorDialog(header: string, body: string) { // TODO: move to a service of its own (like: user-notification service)
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
