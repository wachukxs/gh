import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import {
    HttpClient,
    HttpErrorResponse,
    HttpResponse,
    HttpStatusCode,
} from '@angular/common/http'
import { Router } from '@angular/router'
import { CallerService } from '../services/caller.service'
import { setCorpMemberProfileData } from '../ngrx-store/actions/corp-member.actions'

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

    isLoggingIn: boolean = false

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
            this.isLoggingIn = true

            this.callerService.corpMemberLogIn(this.loginForm.value).subscribe({
                next: (res: HttpResponse<any>) => {

                    console.log('login res', res)

                    this.isLoggingIn = false
                    if (res.status === HttpStatusCode.Ok) {
                        // TODO: Do we need to use localStorage for corper details??
                        localStorage.setItem(this.callerService.LOCAL_STORAGE_DATA_KEY, JSON.stringify(res.body.data));
                        sessionStorage.setItem(this.callerService.SESSION_STORAGE_DATA_KEY, res.body.token);
                        this.callerService._store.dispatch(setCorpMemberProfileData({data: res.body.data}))
                        this.router.navigate(['/home']); // '/dashboard' for agents
                    } else {
                        // TODO: show error message if available
                        this.callerService.showNotification(
                            'Wrong username or password',
                            7000,
                            'Close',
                        )
                    }
                },
                error: (err) => {
                    console.log('login err', err);

                    this.isLoggingIn = false
                    this.callerService.showNotification(
                        err?.error?.message ?? 'Try that again please, an error occurred',
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
