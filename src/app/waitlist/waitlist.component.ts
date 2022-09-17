import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private callerService: CallerService) { }

  ngOnInit(): void {
    this.filteredOptions = this.waitListForm.get('servingstate').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  filteredOptions: Observable<string[]>;

  waitListForm:FormGroup = this._formBuilder.group({
    servingstate: [''],
    firstname: ['', [Validators.required]],
    lastname: [''],
    middlename: [''],
    email: ['', [Validators.required, Validators.email]],
    comment: [''],
  });

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

  joinWaitList() {
    console.log('value', this.waitListForm.value);
    
  }

}
