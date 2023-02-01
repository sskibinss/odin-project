import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() {
  }

  getCreditCardMonths(startMonth: number): Observable<string[]> {
    let data: string[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      if (theMonth < 10) {
        data.push("0" + theMonth);
      } else {
        data.push(String(theMonth));
      }
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear)
    }
    return of(data);
  }
}
