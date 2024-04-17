import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
    selector: 'app-leave-review',
    templateUrl: './leave-review.component.html',
    styleUrls: ['./leave-review.component.css'],
})
export class LeaveReviewComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<LeaveReviewComponent>,
    ) {}

    reviewFormGroup: FormGroup = new FormGroup({
        comment: new FormControl('', [Validators.minLength(3)]),
        star_rating: new FormControl(0),
        ppa_id: new FormControl(this.data.ppa.id),
    })

    ngOnInit(): void {
        console.log('review for', this.data)

        this.reviewFormGroup.get(['star_rating'])?.valueChanges.subscribe({
            next: (value) => {
                console.log('new star rating', value)
            },
        })
    }

    saveDraft() {}

    rateReview(number: any) {
        // console.log('rating', number)

        /**
         * This if-else logic:
         * If we click a star, and it's already selected, unselect it.
         */
        if (number === this.reviewFormGroup?.get(['star_rating'])?.value) {
            this.reviewFormGroup?.get(['star_rating'])?.setValue(number - 1)
        } else {
            this.reviewFormGroup?.get(['star_rating'])?.setValue(number)
        }
    }

    saveReview() {
        if (this.reviewFormGroup.valid) {
            this.dialogRef.close(this.reviewFormGroup.value)
        }
    }

    close() {
        this.dialogRef.close()
    }

    get emptyReview(): boolean {
        return (
            !this.reviewFormGroup.get(['comment'])?.value &&
            !this.reviewFormGroup.get(['star_rating'])?.value
        )
    }
}
