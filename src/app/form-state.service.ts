import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {

  private readonly form1state = new BehaviorSubject<object>({name: '', text: ''});

  // Expose the observable$ part of the form subject (read only stream)
  readonly form$ = this.form1state.asObservable();

  // the getter will return the last value emitted in form subject
  private get form(): object {
    return this.form1state.getValue();
  }

  // assigning a value to this.todos will push it onto the observable
  // and down to all of its subsribers (ex: this.todos = [])
  private set form(val: object) {
    this.form1state.next(val);
  }

  editForm(key: string, val: string) {
    // we edit the form
    this.form[key] = val;
  }

  constructor() { }
}
