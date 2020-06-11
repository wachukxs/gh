import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormStateService } from '../services/form-state.service';





@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  sampleForm = new FormGroup({
    name: new FormControl(''),
    text: new FormControl('')
  });

  constructor(public formStateService: FormStateService) { }

  onSubmit() {
    console.warn('form data:');
  }

  ngOnInit() {
    this.sampleForm.valueChanges.subscribe(x => {
      console.log('value change', x);

      // set the BehaviorSubject here
    });

    this.formStateService.form$.subscribe(u => {
      console.log('it:::', u);
      this.sampleForm.setValue(u);
    });

  }

  editName(event: any) {
    this.formStateService.editForm('name', event.target.value);
  }

  editText(event: any) {
    this.formStateService.editForm('text', event.target.value);
  }

}

