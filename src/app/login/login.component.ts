import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import {
    HttpClient,
    HttpErrorResponse,
    HttpResponse,
} from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CallerService } from '../services/caller.service'
import { setCorpMember } from '../ngrx-store/actions/corp-member.actions'

/**
 * README
 * 1. https://dribbble.com/shots/17408454-Login-Form-Prototype We should use the right side to show some important info
 * 1.1 Like new features, or just welcome them
 */

declare interface PostResponse {
    message: string
    response_code: number
    response: string
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    @ViewChild('passwordInput') passwordInput!: ElementRef

    hideLoginMatSpinner: boolean = false
    hideLoginText: boolean = true

    passwordInputIcon: string = 'visibility'

    constructor(
        private callerService: CallerService,
        private httpClient: HttpClient,
        private router: Router,
    ) {}

    loginForm = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(4),
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    })

    ngOnInit() {}

    login() {
        console.log(this.loginForm.value)
        if (this.loginForm.valid) {
            this.hideLoginText = !this.hideLoginText
            this.hideLoginMatSpinner = !this.hideLoginMatSpinner

            this.callerService.corpMemberLogIn(this.loginForm.value).subscribe({
                next: (res: HttpResponse<any>) => {
                    this.hideLoginText = !this.hideLoginText
                    this.hideLoginMatSpinner = !this.hideLoginMatSpinner

                    console.log('login res', res)
                    if (res.status === 200) {
                        // we're good
                        localStorage.setItem('online-corper', JSON.stringify(res.body.data));
                        this.callerService._store.dispatch(setCorpMember({data: res.body.data}))
                        this.router.navigate(['/home']); // retired /dashboard for agents
                    } else {
                        // show error message
                        this.callerService.showNotification(
                            'Wrong username or password',
                            4000,
                            'Close',
                        )
                    }
                },
                error: (err) => {
                    console.log('login err', err);
                    this.hideLoginText = !this.hideLoginText
                    this.hideLoginMatSpinner = !this.hideLoginMatSpinner

                    this.callerService.showNotification(
                        'Try that again please, an error occured',
                        4000,
                        'Close',
                    )
                },
            })
        } else {
            // tell the user
            this.callerService.showNotification(
                'Invalid form input',
                4000,
                'Close',
            )
        }
    }

    togglePasswordInputIcon(): void {
        if (this.passwordInputIcon == 'visibility') {
            this.passwordInputIcon = 'visibility_off'
            this.passwordInput.nativeElement.type = 'text'
        } else {
            this.passwordInputIcon = 'visibility'
            this.passwordInput.nativeElement.type = 'password'
        }
    }
}
