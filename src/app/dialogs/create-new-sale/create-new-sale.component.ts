import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { CallerService } from '../../services/caller.service'
import { HttpStatusCode } from '@angular/common/http'
import { SocketIoService } from '../../services/socket-io.service'

interface ImagePreview {
    name: string
    dataUrl: string
    lastModified: number
    size: number
}

@Component({
    selector: 'app-create-new-sale',
    templateUrl: './create-new-sale.component.html',
    styleUrls: ['./create-new-sale.component.css'],
})
export class CreateNewSaleComponent implements OnInit, AfterViewInit {

    submittingSale: boolean = false;
    // TODO: NOT WORKING
    @ViewChild('imgFileInput', { read: HTMLInputElement, static: true })
    imgFileInput!: HTMLInputElement

    constructor(
        private _formBuilder: FormBuilder,
        private createPostDialogRef: MatDialogRef<CreateNewSaleComponent>,
        private callerService: CallerService,
        private socketService: SocketIoService,
    ) {}

    salePostFormData: FormData = new FormData()

    saleImagesPreview: Array<ImagePreview> = []

    saleFormGroup: FormGroup = new FormGroup({
        price: new FormControl('', [Validators.required, Validators.min(1)]), // TODO: min should be 1
        minimum_price: new FormControl(''),
        is_item_negotiable: new FormControl(false),
        text: new FormControl(''),
        item_name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
    })

    ngOnInit(): void {
        console.log('this.imgFileInput.1', this.imgFileInput)
        
        this.saleFormGroup
            .get(['is_item_negotiable'])
            ?.valueChanges.subscribe((value: boolean) => {
                // console.log('new is_item_negotiable value', value)
                if (value) {
                    this.saleFormGroup
                        .get(['minimum_price'])
                        ?.setValidators([
                            Validators.required,
                            Validators.max(
                                this.saleFormGroup?.get(['price'])?.value,
                            ),
                        ]) // can't be more than price.
                } else {
                    // reset the value
                    this.saleFormGroup.get(['minimum_price'])?.setValue(null)

                    // remove previous validations
                    this.saleFormGroup
                        .get(['minimum_price'])
                        ?.removeValidators([
                            Validators.required,
                            Validators.max(
                                this.saleFormGroup?.get(['price'])?.value,
                            ),
                        ])
                }

                this.saleFormGroup
                    .get(['minimum_price'])
                    ?.updateValueAndValidity()
            })

        this.saleFormGroup.get(['price'])?.valueChanges.subscribe((value) => {
            // console.log('price value', value)

            if (this.saleFormGroup.get(['is_item_negotiable'])?.value) {
                this.saleFormGroup
                    .get(['minimum_price'])
                    ?.setValidators([
                        Validators.required,
                        Validators.max(
                            this.saleFormGroup?.get(['price'])?.value,
                        ),
                    ]) // can't be more than price.

                this.saleFormGroup
                    .get(['minimum_price'])
                    ?.updateValueAndValidity()
            }
        })
    }

    ngAfterViewInit(): void {
        console.log('this.imgFileInput.2', this.imgFileInput)
    }

    populateFormData(): void {
        for (const field in this.saleFormGroup.controls) {
            // console.log(field, this.accommodationFormGroup.get(field))
            switch (field) {
                default:
                    this.salePostFormData.set(
                        field,
                        this.saleFormGroup.get(field)?.value,
                    )
                    break
            }
        }

        console.log('this.salePostFormData', this.salePostFormData)
    }

    /**
     * Also removes images.
     */
    clearFormDataAndImages(): void {
        this.salePostFormData = new FormData() // reset

        /**
         * reset the input form, so if you select the same file again it'll work
         * TODO: bug, imgFileInput is turning up null.
         */
        // this.imgFileInput.value = ''

        // reset the form after filling it
        this.saleFormGroup.reset()
        for (let _control in this.saleFormGroup.controls) {
            this.saleFormGroup.controls[_control].setErrors(null)
        }

        this.saleImagesPreview = []
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
        this.salePostFormData.set(
            `sale-media-${file.lastModified}-${file.size}-${file.name}`,
            file,
        ) // setting individually so it's easier to delete.
    }

    submit(): void {
        if (this.saleFormGroup.valid) {
            console.log('submitting...')
            this.populateFormData()

            this.submittingSale = true
            // TODO: check that this.createNewSalePost is valid
            this.callerService
                .createNewSalePost(this.salePostFormData)
                .subscribe({
                    next: (res) => {
                        console.log('res body', res.body)
                        if (res.status === HttpStatusCode.Ok) {
                            this.callerService.showNotification('Sale posted')
                            
                            this.clearFormDataAndImages()
                        } else {
                            // TODO: maybe show the message from the backend.
                            this.callerService.showNotification(
                                'An error occurred',
                            )
                        }

                        this.submittingSale = false
                    },
                    error: (err) => {
                        console.log('err', err)
                        this.submittingSale = false
                        this.callerService.showNotification('An error occurred')
                    },
                })
        } else {
            this.callerService.showNotification('Please fix invalid fields')

            // console.log('form value', this.saleFormGroup.value)

            // console.log(
            //     'saleFormGroup ish',
            //     this.saleFormGroup.get(['minimum_price']),
            // )

            this.saleFormGroup.markAllAsTouched()
            this.saleFormGroup.updateValueAndValidity()
        }
    }

    close(): void {
        this.createPostDialogRef.close()
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

    saveDraft() {
        
    }
}
