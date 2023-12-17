import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';
import { CorpMemberState } from '../ngrx-store/app.state';
import { select } from '@ngrx/store';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { profileUpdateSuccess, setCorpMemberProfileData } from '../ngrx-store/actions/corp-member.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private callerService: CallerService) { }

  filteredOptions: Observable<string[]> | undefined;

  serviceDetailsFormGroup: FormGroup = new FormGroup({
    service_state: new FormControl(this.callerService.corpMember?.service_state),
    lga: new FormControl(this.callerService.corpMember?.lga),
    city_or_town: new FormControl(this.callerService.corpMember?.city_or_town),
    stream: new FormControl(this.callerService.corpMember?.stream),
  })

  otherDetailsFormGroup: FormGroup = new FormGroup({
    origin_state: new FormControl(null),
    where_they_found_accommodation: new FormControl(null),
    origin_city_or_town: new FormControl(null),
    want_spa_or_not: new FormControl(null),
    looking_for_accommodation_or_not: new FormControl(null),
  })

  ppaDetailsFormGroup: FormGroup = new FormGroup({
    ppa_name: new FormControl(null),
    type_of_institution: new FormControl(null),
    ppa_address: new FormControl(null),
    ppa_directions: new FormControl(null),
  })

  bioDetailsFormGroup: FormGroup = new FormGroup({
    public_profile: new FormControl(this.callerService.corpMember?.public_profile),
    nickname: new FormControl(this.callerService.corpMember?.nickname),
    bio: new FormControl(this.callerService.corpMember?.bio),
  })

  // combo form
  profileFormGroup: FormGroup = new FormGroup({
    bioDetails: this.bioDetailsFormGroup,
    ppaDetails: this.ppaDetailsFormGroup,
    otherDetails: this.otherDetailsFormGroup,
    serviceDetails: this.serviceDetailsFormGroup,
  })

  // not using.
  // profileForm:FormGroup = this._formBuilder.group({
  //   servingstate: ['', [Validators.required]],
  // });

  serviceStreams: Array<string> = ['1', '2', '3']

  ngOnInit(): void {
    this.filteredOptions = this.serviceDetailsFormGroup.get('service_state')?.valueChanges.pipe(
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

    console.log('hey, this is me', this.callerService.corpMember);
    
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * Depreciated
   */
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
      this.callerService.updateProfile(this.serviceDetailsFormGroup.value).subscribe({
        next: (res) => {
          console.log('updated updateProfile', res);
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
      this.callerService.updateProfileOtherDetails(this.otherDetailsFormGroup.value)
      .subscribe({
        next: (res) => {
          console.log('updated otherDetailsFormGroup', res);
        },
        error: (err) => {
            this.callerService.showNotification('Failed to update Other Details')
        },
      })
    }
  }

  /**
   * Upgrade method from updateCorpMemberProfile().
   * 
   * update with ~Promise.all~ forkJoin()
   * Create ngrx actions to cater for this.
   */
  updateEverything(): void {
    // trying formgroup of formgroups
    console.log('profileFormGroup', this.profileFormGroup.value);
    
    
    const updateMethods = []

    if (this.otherDetailsFormGroup.dirty) {
      updateMethods.push(this.callerService.updateProfileOtherDetails(this.otherDetailsFormGroup.value))
    }

    if (this.ppaDetailsFormGroup.dirty) {
      updateMethods.push(this.callerService.updateProfilePpaDetails(this.ppaDetailsFormGroup.value))
    }

    if (this.bioDetailsFormGroup.dirty) {
      updateMethods.push(this.callerService.updateProfileBio(this.bioDetailsFormGroup.value))
    }

    if (this.serviceDetailsFormGroup.pristine) {
      updateMethods.push(this.callerService.updateProfileServiceDetails(this.serviceDetailsFormGroup.value))
    }

    forkJoin(updateMethods).subscribe((values) => {
      console.log('updateEverything res??', values);

      if (values.every(res => res.status === HttpStatusCode.Ok)) {
        this.callerService.showNotification('Profile updated')
      } else {
        // TODO: Find the sections that didn't update, and show an appropriate message.
        this.callerService.showNotification('Profile update failed.')
      }
    })
  }

  /**
   * Upgrade from updateEverything().
   */
  updateProfile(): void {
    this.callerService.updateProfile({
      ...this.serviceDetailsFormGroup.value,
      ...this.bioDetailsFormGroup.value,
      ...this.ppaDetailsFormGroup.value,
      ...this.otherDetailsFormGroup.value
    }).subscribe({
      next: (res: HttpResponse<any>) => {
        console.log('updated profile', res);
        if (res.status === HttpStatusCode.Ok) {
          this.callerService._store.dispatch(profileUpdateSuccess({data: res.body.data}))

          this.callerService.showNotification('Profile updated')
        }
      },
      error: (err) => {
        console.log('NOT updated profile', err);
          this.callerService.showNotification(err?.error?.message ?? 'Failed to update profile')
      },
    })
  }
}
