import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  serviceDetailsFormGroup: FormGroup = new FormGroup({
    servicestate: new FormControl(''),
    lga: new FormControl(''),
    cityOrTown: new FormControl(''),
    street: new FormControl(''),
    stream: new FormControl(''),
  })

  otherDetailsFormGroup: FormGroup = new FormGroup({
    originState: new FormControl(''),
    whereTheyFoundAccommodation: new FormControl(''),
    originCityOrTown: new FormControl(''),
    wantSpa: new FormControl(''),
    lookingForAccommodation: new FormControl(''),
  })

  ppaDetailsFormGroup: FormGroup = new FormGroup({
    ppaName: new FormControl(''),
    typeOfInstitution: new FormControl(''),
    ppaAddress: new FormControl(''),
    ppaDirections: new FormControl(''),
  })

  bioDetailsFormGroup: FormGroup = new FormGroup({
    publicProfile: new FormControl(''),
    nickname: new FormControl(''),
    profile: new FormControl(''),
  })

  // not using.
  // profileForm:FormGroup = this._formBuilder.group({
  //   servingstate: ['', [Validators.required]],
  // });

  serviceStreams = [1, 2, 3]

  ngOnInit(): void {
    this.filteredOptions = this.serviceDetailsFormGroup.get('servicestate')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.serviceDetailsFormGroup.valueChanges.subscribe({
      next: (values) => {
        // console.log('values', values);
      }
    })

    this.bioDetailsFormGroup.valueChanges.subscribe({
      next: (values) => {
        // console.log('values', values);
      }
    })

    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

  updateCorpMemberProfile(): void {
    console.log('clicked Update!');

    console.table([
      ['this.serviceDetailsFormGroup', this.serviceDetailsFormGroup.pristine],
      ['this.bioDetailsFormGroup', this.bioDetailsFormGroup.pristine],
      ['this.ppaDetailsFormGroup', this.ppaDetailsFormGroup.pristine],
      ['this.otherDetailsFormGroup', this.otherDetailsFormGroup.pristine],
    ])
    
    // check this.serviceDetailsFormGroup.pristine
    if (this.serviceDetailsFormGroup.pristine) {
      this.callerService.updateProfileServiceDetails(this.serviceDetailsFormGroup.value).subscribe({
        next: (res) => {
          console.log('updated updateProfileServiceDetails', res);
        },
        error: (err) => {
            this.callerService.showNotification('Failed to update Profile Details')
        },
      })
    }

    if (this.bioDetailsFormGroup.dirty) {
      this.callerService.updateProfileBio(this.bioDetailsFormGroup.value).subscribe({
        next: (res) => {
          console.log('updated updateProfileBio', res);
        },
        error: (err) => {
            this.callerService.showNotification('Failed to update Bio Details')
        },
      })
    }

    if (this.ppaDetailsFormGroup.dirty) {
      this.callerService.updateProfilePpaDetails(this.ppaDetailsFormGroup.value).subscribe({
        next: (res) => {
          console.log('updated updateProfilePpaDetails', res);
        },
        error: (err) => {
            this.callerService.showNotification('Failed to update PPA Details')
        },
      })
    }

    if (this.otherDetailsFormGroup.dirty) {
      this.callerService.updateProfileOtherDetails(this.otherDetailsFormGroup.value).subscribe({
        next: (res) => {
          console.log('updated otherDetailsFormGroup', res);
        },
        error: (err) => {
            this.callerService.showNotification('Failed to update Other Details')
        },
      })
    }
  }

}
