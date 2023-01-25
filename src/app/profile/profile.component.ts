import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private callerService: CallerService) { }

  filteredOptions: Observable<string[]> | undefined;

  profileForm:FormGroup = this._formBuilder.group({
    servingstate: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.filteredOptions = this.profileForm.get('servingstate')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

}
