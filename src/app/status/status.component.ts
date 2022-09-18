import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormStateService } from '../services/form-state.service';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  sampleForm = new FormGroup({
    name: new FormControl(''),

    text: new FormControl('')
  });

  constructor(public formStateService: FormStateService) { }

  ngOnInit() {
    this.sampleForm.valueChanges.subscribe(x => {
      console.log('value change', x);

      // set the BehaviorSubject here
    });

    this.formStateService.form$.subscribe(u => {
      console.log('it:::', u);
      
      // this.sampleForm.setValue(u); // set error
    });
  }

  editName(event: any) {
    this.formStateService.editForm('name', event.target.value);
  }

  editText(event: any) {
    this.formStateService.editForm('text', event.target.value);
  }

}
