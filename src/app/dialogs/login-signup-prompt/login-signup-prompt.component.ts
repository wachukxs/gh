import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'

@Component({
    selector: 'app-login-signup-prompt',
    templateUrl: './login-signup-prompt.component.html',
    styleUrls: ['./login-signup-prompt.component.css'],
})
export class LoginSignupPromptComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<LoginSignupPromptComponent>,

        private router: Router,
    ) {}

    goLogin() {
      this.router.navigate(['/login'])
    }

    goSignUp() {
      this.router.navigate(['/signup'])
    }

    close() {
      this.dialogRef.close()
    }
}
