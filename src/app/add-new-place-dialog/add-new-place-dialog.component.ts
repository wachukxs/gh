import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { CallerService } from '../services/caller.service'
import { HttpResponse } from '@angular/common/http'

@Component({
    selector: 'app-add-new-place-dialog',
    templateUrl: './add-new-place-dialog.component.html',
    styleUrls: ['./add-new-place-dialog.component.css'],
})
export class AddNewPlaceDialogComponent implements OnInit {
    ng_states: any[] = []

    ng_states_lgas: any[] = []

    constructor(
        private newPpaDialogRef: MatDialogRef<AddNewPlaceDialogComponent>,
        private callerService: CallerService,
    ) {}

    newPlaceForm: FormGroup = new FormGroup(
        {
            name: new FormControl(''),
            address: new FormControl(''),
            category: new FormControl(''),
            state_id: new FormControl(''),
            state_lga_id: new FormControl(''),
        },
        [Validators.required],
    )

    ppaFormData: FormData = new FormData()

    close(): void {
        this.newPpaDialogRef.close()
    }

    ngOnInit(): void {
        this.callerService.fetchAllNigeriaStates().subscribe({
            next: (res: HttpResponse<any>) => {
                console.log('data', res)

                this.ng_states = res.body?.states
            },
            error: (err) => {
                this.callerService.showNotification('Failed...')
            },
        })

        this.newPlaceForm.get(['state_id'])?.valueChanges.subscribe({
            next: (value) => {
                console.log('new state value', value)

                this.callerService.fetchNigeriaStateLGAs(value).subscribe({
                    next: (res: HttpResponse<any>) => {
                        console.log('data', res)

                        this.ng_states_lgas = res.body?.lgas
                    },
                    error: (err) => {
                        this.callerService.showNotification('Failed...')
                    },
                })
            },
        })
    }

    populateFormData(): void {
        for (const field in this.newPlaceForm.controls) {
            // console.log(field, this.newPlaceForm.get(field))
            this.ppaFormData.set(field, this.newPlaceForm.get(field)?.value)
        }

        console.log('this.ppaFormData', this.ppaFormData)
    }

    postNewPlace(): void {
        console.log('this.newPlaceForm.value', this.newPlaceForm.value)

        // TODO: convert to form data to allow upload of images/videos??

        if (this.newPlaceForm.valid) {
            this.populateFormData()

            // TODO: check that this.accommodationPostFormData is valid
            this.callerService.addNewPPA(this.ppaFormData).subscribe({
                next: (res) => {
                    console.log('res', res)
                    if (res.status === 200) {
                        this.callerService.showNotification('PPA added!') // show link to the PPA? For them to also share in groups, PPA should have directions on how to find it??
                        // TODO: reset form, show notification
                    } else {
                        // else show error message?
                    }
                },
                error: (err) => {
                    console.log('err', err)
                },
            })
        } else {
            // todo: ??
        }
    }
}
