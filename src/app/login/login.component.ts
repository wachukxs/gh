import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallerService } from '../services/caller.service';

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

  @ViewChild('passwordInput') passwordInput!: ElementRef;

  hideLoginMatSpinner: boolean = false;
  hideLoginText: boolean = true;

  passwordInputIcon: string = 'visibility';

  constructor(private callerService: CallerService, private httpClient: HttpClient, private router: Router) { }

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

      this.hideLoginText = !this.hideLoginText
      this.hideLoginMatSpinner = !this.hideLoginMatSpinner
      
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
            this.callerService.showNotification('Wrong username or password', 4000, 'Close')
          }
        }, (err: any) => {
          this.callerService.showNotification('Try that again please, an error occured', 4000, 'Close')
      });
    } else { // tell the user
      this.callerService.showNotification('Invalid form input', 4000, 'Close')
    }
  }

  togglePasswordInputIcon(): void {
    if (this.passwordInputIcon == 'visibility') {
      this.passwordInputIcon = 'visibility_off';
      this.passwordInput.nativeElement.type = 'text';
    } else {
      this.passwordInputIcon = 'visibility';
      this.passwordInput.nativeElement.type = 'password';
    }
  }

}
