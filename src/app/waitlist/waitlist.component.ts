import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {

  submittingWaitlist: boolean = false

  constructor(private _formBuilder: FormBuilder, private callerService: CallerService, 
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,) { }

  ngOnInit(): void {
    this.filteredOptions = this.waitListForm.get('serving_state')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    // hi the server...
    this.callerService.sayHi().subscribe()
  }

  filteredOptions: Observable<string[]> | undefined;

  waitListForm:FormGroup = this._formBuilder.group({
    serving_state: ['', [Validators.required]],
    first_name: ['', [Validators.required]],
    last_name: [''],
    middle_name: [''],
    email: ['', [Validators.required, Validators.email]],
    comment: [''],
  });

  // TODO: this will be repeated in multiple places, how can we make it in only one place.
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

  joinWaitList() {
    console.log('valid?', this.waitListForm.valid, 'value:', this.waitListForm.value);

    if (this.waitListForm.valid) {

      this.submittingWaitlist = true

      this.callerService.joinWaitList(this.waitListForm.value).subscribe({
        next: (res: any) => {
          console.log('who joined?', res);

          let _first_name = this.waitListForm.get('first_name')?.value

          this.submittingWaitlist = false
          this.waitListForm.reset({
            serving_state: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            comment: '',
          }, {
            // onlySelf: true,
            // emitEvent: true
          })

          for (let control in this.waitListForm.controls) { // not a good hack
            this.waitListForm.controls[control].setErrors(null);
          }

          // this.waitListForm.markAsPristine()
          // this.waitListForm.markAsUntouched()

          this.waitListForm.markAsTouched()
          this.waitListForm.updateValueAndValidity()

          // tell them to share with their friends

          this.callerService.showNotification("Great! We'll holla at you in a bit.")

          // this.dialog.open(JoinWaitlistSuccessDialogComponent, {
          //   width: '100%',
          //   height: '100%',
          //   data: {
          //     first_name: _firstname
          //   },
          //   maxWidth: '100%',
          //   maxHeight: '100%',
          //   ariaLabel: 'Success dialog after joining wait list'
          // })

          // this.bottomSheet.open(JoinWaitlistSuccessBottomsheetComponent, {
          //   data: {
          //     first_name: _firstname
          //   },
          // });
        },
        error: (err: any) => {
          console.log('why NOT joined?', err);

          this.submittingWaitlist = false
          if (err.status == 400) { // we sent bad data
            this.callerService.showNotification(err.error.error || err.error.message || err.error.error.message, 1500)
          } else {
            this.callerService.showNotification('An error occurred. Maybe try again.')
          }

        },
      })
    } else {
      console.log(this.waitListForm.get('email')?.errors);
      
      // this.callerService.showNotification("Some errors on the form", 8000)
    }
    
  }

}
