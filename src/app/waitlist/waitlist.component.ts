import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {

  @ViewChild('waitlistjoinbutton') waitListBtn: MatButton;
  hideJoinMatSpinner: boolean = false;
  hideJoinText: boolean = true;

  constructor(private _formBuilder: FormBuilder, private callerService: CallerService) { }

  ngOnInit(): void {
    this.filteredOptions = this.waitListForm.get('servingstate').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  filteredOptions: Observable<string[]>;

  waitListForm:FormGroup = this._formBuilder.group({
    servingstate: ['', [Validators.required]],
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

    if (this.waitListForm.valid) {
      this.hideJoinMatSpinner = !this.hideJoinMatSpinner
      this.hideJoinText = !this.hideJoinText

      this.callerService.joinWaitList(this.waitListForm.value).subscribe({
        next: (res: any) => {
          console.log('who joined?', res);

          this.waitListForm.reset()
          for (let control in this.waitListForm.controls) {
            this.waitListForm.controls[control].setErrors(null);
          }

          this.callerService.showNotification("Great! We'll holla at you in a bit.")

          this.hideJoinMatSpinner = !this.hideJoinMatSpinner
          this.hideJoinText = !this.hideJoinText
        },
        error: (err: any) => {
          console.log('why NOT joined?', err);

          this.hideJoinMatSpinner = !this.hideJoinMatSpinner
          this.hideJoinText = !this.hideJoinText
        }
      })
    } else {
      console.log(this.waitListForm.get('email').errors);
      
      // this.callerService.showNotification("Some errors on the form", 8000)
    }
    
  }

}
