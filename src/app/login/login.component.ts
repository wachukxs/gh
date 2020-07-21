import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare interface PostResponse {
  message: string;
  response_code: number;
  response: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  ngOnInit() {
  }

  login() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      // previously http://localhost:8083/greenhomes/php/api/agents/verify.php
      this.httpClient.post(`${environment.baseurl}/api/v1/agents/`,
      JSON.stringify(this.loginForm.value)).subscribe((res: PostResponse) => {
        console.log('result', res);
        if (res.response === 'OK') {
          console.log('redirecting');
          this.router.navigate(['/dashboard']);
        }
      }, err => {
        console.log('err', err);
      }/* , () => {
        console.log('completed the http signup');
      } */);
    } else { // tell them
    }
  }

}
