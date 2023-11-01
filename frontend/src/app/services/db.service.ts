import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private data: any[] = [];

  addToDatabase(value: any) {
    this.data.push(value);
  }

  getDatabase(): any[] {
    return this.data;
  }
}
