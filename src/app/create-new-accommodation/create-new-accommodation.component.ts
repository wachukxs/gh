import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CallerService } from '../services/caller.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'create-new-accommodation',
  templateUrl: './create-new-accommodation.component.html',
  styleUrls: ['./create-new-accommodation.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CreateNewAccommodationComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private createPostDialogRef: MatDialogRef<CreateNewAccommodationComponent>
    , private callerService: CallerService) { }

  accommodationFormGroup = new FormGroup({
    accommodationType: new FormControl(''),
    availableRooms: this._formBuilder.group({
      "Sitting-room": false,
      "Kitchen": false,
      "Bedroom": false,
      "Toilet": false,
      "Bathroom": false,
      "Dining-room": false,
    }),
    location: new FormGroup({
      address: new FormControl(''),
      directions: new FormControl('')
    }),
    status: new FormControl(''),
    rent: new FormControl(''),
    rentInterval: new FormControl(''),
  });
  
  stepperOrientation: StepperOrientation = 'vertical'


  ngOnInit(): void {
    this.callerService.isSmallScreen$().subscribe({
      next: (value) => { // TODO: do we wanna pipe() instead?
        if (value) {
          this.stepperOrientation = 'vertical'
        } else {
          this.stepperOrientation = 'horizontal'
        }
      }
    })

    this.accommodationFormGroup.valueChanges.subscribe({
      next: (value) => {
        console.log('new accommodation value', value);
      },
    })

    this.accommodationFormGroup.get(['status'])?.valueChanges.subscribe({
      next: (value) => {
        console.log('new accommodation value', value);
      },
    })
  }

  postForm: FormData = new FormData()

  close(): void {
    this.createPostDialogRef.close()
  }

  /**
   * https://github.com/microsoft/TypeScript/issues/31816#issuecomment-646000392
   * @param event file input
   */
  onFileSelected(event: Event): void {
    console.log('evt', event);

    console.log('UI', (event.target as HTMLInputElement)?.files);
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        this.postForm.set(`file-${fileIndex}`, file)
      }
    }
  }

  submit(): void {
    // how do we check that this.postForm is valid?
    this.callerService.createNewPost(this.postForm).subscribe({
      next: (res) => {
        console.log('res', res);
      },
      error: (err) => {
        console.log('err', err);
      }
    })
  }

}
