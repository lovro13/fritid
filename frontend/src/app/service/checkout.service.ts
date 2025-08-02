import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PersonInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  companyID?: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private personInfoSubject = new BehaviorSubject<PersonInfo | null>(null);
  personInfo$ = this.personInfoSubject.asObservable();

  setPersonInfo(info: PersonInfo) {
    this.personInfoSubject.next(info);
  }
}