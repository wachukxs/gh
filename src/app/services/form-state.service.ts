import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface _FromState {
  name: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormStateService {

  private readonly form1state = new BehaviorSubject<_FromState>({name: '', text: ''});

  // Expose the observable$ part of the form subject (read only stream)
  readonly form$ = this.form1state.asObservable();

  // the getter will return the last value emitted in form subject
  private get form(): _FromState {
    return this.form1state.getValue();
  }

  // assigning a value to this.todos will push it onto the observable
  // and down to all of its subsribers (ex: this.todos = [])
  private set form(val: _FromState) {
    this.form1state.next(val);
  }

  editForm(key: keyof _FromState, val: string) {
    // we edit the form
    this.form[key] = val;
  }

  constructor() { }
}
