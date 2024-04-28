import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { CallerService } from '../../services/caller.service'
import { HttpResponse } from '@angular/common/http'

interface ImagePreview {
    name: string
    dataUrl: string
    lastModified: number
    size: number
}

@Component({
    selector: 'app-add-new-place-dialog',
    templateUrl: './add-new-place-dialog.component.html',
    styleUrls: ['./add-new-place-dialog.component.css'],
})
export class AddNewPlaceDialogComponent implements OnInit {
    ng_states: any[] = []

    ng_states_lgas: any[] = []

    saleImagesPreview: Array<ImagePreview> = []

    constructor(
        private newPpaDialogRef: MatDialogRef<AddNewPlaceDialogComponent>,
        private callerService: CallerService,
    ) {}

    newPlaceForm: FormGroup = new FormGroup(
        {
            name: new FormControl(''),
            address: new FormControl(''),
            category: new FormControl(''),
            state_id: new FormControl('', [Validators.required]),
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
                        // TODO: reset form properly?

                        this.clearFormDataAndImages()
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

    /**
     * Also removes images.
     */
    clearFormDataAndImages(): void {
        this.ppaFormData = new FormData() // reset

        /**
         * reset the input form, so if you select the same file again it'll work
         * TODO: bug, imgFileInput is turning up null.
         */
        // this.imgFileInput.value = ''

        // reset the form after filling it
        this.newPlaceForm.reset()
        for (let _control in this.newPlaceForm.controls) {
            this.newPlaceForm.controls[_control].setErrors(null)
        }

        this.saleImagesPreview = []
    }

    processImage(file: File) {
        const reader = new FileReader() // do we wanna define this every time the function is called?

        reader.onerror = function () {
            console.log('FileReader Err:', reader.error)
        }

        reader.onload = (e: any) => {
            console.log('e', e) // e.target.result
            this.saleImagesPreview.push({
                dataUrl: e.target.result,
                lastModified: file.lastModified,
                name: file.name,
                size: file.size,
            })
        }

        reader.readAsDataURL(file)
        this.ppaFormData.set(
            `ppa-media-${file.lastModified}-${file.size}-${file.name}`,
            file,
        ) // setting individually so it's easier to delete.
    }

    /**
     * TODO: Use the ViewChild instance instead of passing the file instance to this removePreviewImage() method.
     * do same in CreateNewAccommodation Component.
     * @param ifi
     * @param i
     */
    removePreviewImage(imageFileInput: HTMLInputElement, i: number) {
        this.saleImagesPreview.splice(i, 1)

        // clear the input. (incase the same file is deleted and selected again)
        imageFileInput.value = ''
    }

    onFileSelected(event: Event): void {
        console.log('evt', event)

        console.log('UI', (event.target as HTMLInputElement)?.files)
        const target = event.target as HTMLInputElement
        const files = target.files

        if (files && files.length) {
            for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                this.processImage(files[fileIndex])
            }
        }
    }
}
