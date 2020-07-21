import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }
  signupForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    phonenumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{11}|\+234\d{10}$/) // ^\d{11}|\+234\d{10}$
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });

  ngOnInit() {
  }

  signUp() {
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {
      // previously http://localhost:8083/greenhomes/php/api/agents/create.php
      this.httpClient.post('http://127.0.0.1:8000/api/v1/agents/',
      this.signupForm.value).subscribe(res => {
        // make sure we get a response, for now it's nothing. once it's success, we good
        console.log('result', res);
        sessionStorage.setItem('green-homes-agent', JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      }, err => {
        console.log('err', err);
      }, () => {
        console.log('completed the http signup');
      });
    }
  }

}
