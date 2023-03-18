import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  years = parseInt( new Date( Date.now() ).getFullYear().toFixed().slice( 2, 4 ) );
  yearrange = '(' + ( this.years - 1 ).toString() + '|' + this.years.toString() + ')';

  signupForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    statecode: new FormControl('', [
      Validators.required,
      Validators.pattern(`(AB|AD|AK|AN|BA|BY|BN|BO|CR|DT|EB|ED|EK|EN|FC|GM|IM|JG|KD|KN|KT|KB|KG|KW|LA|NS|NG|OG|OD|OS|OY|PL|RV|SO|TR|YB|ZM|ab|ad|ak|an|ba|by|bn|bo|cr|dt|eb|ed|ek|en|fc|gm|im|jg|kd|kn|kt|kb|kg|kw|la|ns|ng|og|od|os|oy|pl|rv|so|tr|yb|zm)\\/${ this.yearrange }[abcACB]\\/[0-9]{4}`)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    middlename: new FormControl('', [
      Validators.minLength(2)
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
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
        localStorage.setItem('online-corper', JSON.stringify(res));
        this.router.navigate(['/home']);
      }, err => {
        console.log('err', err);
      }, () => {
        console.log('completed the http signup');
      });
    } else {
      console.log('sign up form errors', this.signupForm);
    }
  }

}
