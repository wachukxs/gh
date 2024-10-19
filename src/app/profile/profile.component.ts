import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';
import { CorpMemberState } from '../ngrx-store/app.state';
import { select } from '@ngrx/store';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { profileUpdateSuccess } from '../ngrx-store/actions/corp-member.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, public callerService: CallerService) { }

  filteredOptions: Observable<any[]> | undefined;
  filteredOptions_2: Observable<any[]> | undefined;

  stateCodeInputDisabled = false

  isUpdatingProfile = false

  ng_states: any[] = []
  ng_states_and_lgas: any[] = []
  selected_state_lgas: any[] = []

  serviceDetailsFormGroup: FormGroup = new FormGroup({
    service_state: new FormControl(this.callerService.corpMember?.service_state),
    lga: new FormControl(this.callerService.corpMember?.lga),
    city_or_town: new FormControl(this.callerService.corpMember?.city_or_town),
    stream: new FormControl(this.callerService.corpMember?.stream),
    state_code: new FormControl(this.callerService.corpMember?.state_code),
  })

  personalDetailsFormGroup: FormGroup = new FormGroup({
    first_name: new FormControl(this.callerService.corpMember?.first_name),
    last_name: new FormControl(this.callerService.corpMember?.last_name),
    nickname: new FormControl(this.callerService.corpMember?.nickname),
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
    personalDetails: this.personalDetailsFormGroup,
  })

  serviceStreams: Array<string> = ['1', '2', '3']

  ngOnInit(): void {
    

    this.activatedRoute.data.subscribe(({ res }) => {
      // do something with your resolved data ...
      console.log('2nd resolved data', res);
      
      if (res.status === HttpStatusCode.Ok) {
        this.ng_states_and_lgas = res.body?.states_and_lgas

        this.ng_states = this.ng_states_and_lgas.map((s, i) => ({index: i, id: s.id, name: s.name}))
      }
    })

    this.serviceDetailsFormGroup.valueChanges.subscribe({
      next: (values) => {
        // console.log('service details values', values);
      }
    })

    this.serviceDetailsFormGroup.get(['service_state'])
    ?.valueChanges.subscribe({
      next: (values) => {
        console.log('new service state', values);
        // clear lga value on service state change.
        this.serviceDetailsFormGroup.get(['lga'])?.setValue('')
      }
    })

    this.bioDetailsFormGroup.valueChanges.subscribe({
      next: (values) => {
        // console.log('values', values);
      }
    })

    console.log('hey, this is me', this.callerService.corpMember);
    
  }

  setSelectedStatesLGA(event: any, value: any) {
    this.selected_state_lgas = this.ng_states_and_lgas?.[value.index]?.StateLGAs
  }

  toggleStateCodeInputDisabled() {
    this.stateCodeInputDisabled = !this.stateCodeInputDisabled
  }

  /**
   * Depreciated
   * 
   * Missing personalDetailsFormGroup values
   */
  updateCorpMemberProfile(): void {
    console.log('clicked Update!');
    
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
   * 
   * Missing personalDetailsFormGroup values
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
    this.isUpdatingProfile = true
    this.callerService.updateProfile({
      ...this.serviceDetailsFormGroup.value,
      ...this.bioDetailsFormGroup.value,
      ...this.ppaDetailsFormGroup.value,
      ...this.otherDetailsFormGroup.value,
      ...this.personalDetailsFormGroup.value,
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
      complete: () => {
        this.isUpdatingProfile = false
      }
    })
  }
}
