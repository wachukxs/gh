import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    console.log('in ngOnInit', this.callerService.states_long);
    
    this.filteredOptions = this.waitListForm.get('servingstate').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  filteredOptions: Observable<string[]>;

  waitListForm:FormGroup = this._formBuilder.group({
    servingstate: [''],
    name: [''],
  });

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('states', this.callerService.states_long);
    

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

}
