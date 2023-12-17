import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { JoinWaitlistSuccessDialogComponent } from '../dialogs/join-waitlist-success-dialog/join-waitlist-success-dialog.component';
import { JoinWaitlistSuccessBottomsheetComponent } from '../join-waitlist-success-bottomsheet/join-waitlist-success-bottomsheet.component';
import { CallerService } from '../services/caller.service';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {

  @ViewChild('waitlistjoinbutton') waitListBtn: MatButton | undefined;
  hideJoinMatSpinner: boolean = false;
  hideJoinText: boolean = true;

  constructor(private _formBuilder: FormBuilder, private callerService: CallerService, 
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,) { }

  ngOnInit(): void {
    this.filteredOptions = this.waitListForm.get('servingstate')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  filteredOptions: Observable<string[]> | undefined;

  waitListForm:FormGroup = this._formBuilder.group({
    servingstate: ['', [Validators.required]],
    first_name: ['', [Validators.required]],
    last_name: [''],
    middle_name: [''],
    email: ['', [Validators.required, Validators.email]],
    comment: [''],
  });

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
  }

  joinWaitList() {
    console.log('valid?', this.waitListForm.valid, 'value:', this.waitListForm.value);

    if (this.waitListForm.valid) {
      this.hideJoinMatSpinner = !this.hideJoinMatSpinner
      this.hideJoinText = !this.hideJoinText

      this.callerService.joinWaitList(this.waitListForm.value).subscribe({
        next: (res: any) => {
          console.log('who joined?', res);

          let _firstname = this.waitListForm.get('first_name')?.value

          this.waitListForm.reset({
            servingstate: '',
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

          this.hideJoinMatSpinner = !this.hideJoinMatSpinner
          this.hideJoinText = !this.hideJoinText

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

          if (err.status == 400) { // bad data
            this.callerService.showNotification(err.error.error.details[0].message)
          }

          this.hideJoinMatSpinner = !this.hideJoinMatSpinner
          this.hideJoinText = !this.hideJoinText
        }
      })
    } else {
      console.log(this.waitListForm.get('email')?.errors);
      
      // this.callerService.showNotification("Some errors on the form", 8000)
    }
    
  }

}
