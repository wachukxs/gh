import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

/**
 * README
 * 1. https://dribbble.com/shots/17408454-Login-Form-Prototype We should use the right side to show some important info
 * 1.1 Like new features, or just welcome them
 */

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

  constructor(private snackBar: MatSnackBar, private httpClient: HttpClient, private router: Router) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
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
      // tslint:disable-next-line: max-line-length
      this.httpClient.get(`${environment.baseurl}/api/v1/agents/\?username=${this.loginForm.controls.username.value}&password=${this.loginForm.controls.password.value}`)
        .subscribe((res: any) => {
          console.log('login res', res);
          if (res.objects.length === 1) { // we're good
          // sessionStorage.setItem('green-homes-agent', JSON.stringify(res));
          delete res.objects[0].password;
          sessionStorage.setItem('green-homes-agent', JSON.stringify(res.objects[0]));
          this.router.navigate(['/dashboard']);
          } else { // show error message
            this.snackBar.open('Wrong username or password', 'Close', {
              duration: 4000,
            });
          }
        }, (err: any) => {
          this.snackBar.open('Try that again please, an error occured', 'Close', {
            duration: 4000,
          });
      });
    } else { // tell them
      this.snackBar.open('Invalid form input', 'Close', {
        duration: 4000,
      });
    }
  }

}
