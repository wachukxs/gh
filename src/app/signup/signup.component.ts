import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../environments/environment';
import { CallerService } from '../services/caller.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private callerService: CallerService, private router: Router) { }


  signupForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    state_code: new FormControl('', [
      Validators.required,
      Validators.pattern(this.callerService.state_code_regex)
     
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    // first_name: new FormControl('', [
    //   // Validators.required,
    //   // Validators.minLength(2)
    // ]),
    // middle_name: new FormControl('', [
    //   Validators.minLength(2)
    // ]),
    // last_name: new FormControl('', [
    //   // Validators.required,
    //   // Validators.minLength(2)
    // ]),
  });

  ngOnInit() {
  }

  signUp() {
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {

      this.callerService.signUp(this.signupForm.value)
      .subscribe((res: any) => {
        // make sure we get a response, for now it's nothing. once it's success, we good
        console.log('result', res);
        localStorage.setItem(this.callerService.LOCAL_STORAGE_DATA_KEY, JSON.stringify(res));
        this.router.navigate(['/home']);
      }, (err: HttpErrorResponse) => {
        console.log('err', err);
        this.callerService.showNotification(err?.error?.message ?? "An error occurred")
      }, () => {
        console.log('completed the http signup');
      });
    } else {
      console.log('sign up form errors', this.signupForm);
    }
  }

}
