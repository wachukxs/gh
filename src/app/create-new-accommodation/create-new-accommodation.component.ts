import { StepperOrientation } from '@angular/cdk/stepper'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { CallerService } from '../services/caller.service'
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'

interface ImagePreview {
    name: string
    dataUrl: string
    lastModified: number
    size: number
}

interface Rooms {
    value: string
    viewValue: string
}

@Component({
    selector: 'create-new-accommodation',
    templateUrl: './create-new-accommodation.component.html',
    styleUrls: ['./create-new-accommodation.component.css'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class CreateNewAccommodationComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private createPostDialogRef: MatDialogRef<CreateNewAccommodationComponent>,
        private callerService: CallerService,
    ) {}

    accommodationImagesPreview: Array<ImagePreview> = []

    availableHouseRooms: Array<Rooms> = [
        {
            value: 'Bathroom',
            viewValue: 'Bathroom',
        },
        {
            value: 'Sitting Room',
            viewValue: 'Sitting Room',
        },
        {
            value: 'Toilet',
            viewValue: 'Toilet',
        },
        {
            value: 'Kitchen',
            viewValue: 'Kitchen',
        },
        {
            value: 'Bathroom & Toilet',
            viewValue: 'Bathroom & Toilet',
        },
        {
            value: 'Hallway or Corridor',
            viewValue: 'Hallway/Corridor',
        },
        {
            value: 'Frontage',
            viewValue: 'Frontage',
        },
    ]

    accommodationFormGroup: FormGroup = new FormGroup({
        accommodation_type: new FormControl(''),
        available_rooms: this._formBuilder.group({
            'Sitting-room': false,
            Kitchen: false,
            Bedroom: false,
            Toilet: false,
            Bathroom: false,
            'Dining-room': false,
        }),
        address: new FormControl(''),
        directions: new FormControl(''),
        status: new FormControl(''),
        rent: new FormControl('', [Validators.min(1)]),
        rent_interval: new FormControl(''),
        rent_expire_date: new FormControl(''),
        ideal_roommate: new FormControl(''),
        occupant_description: new FormControl(''),
    })

    stepperOrientation: StepperOrientation = 'vertical'

    ngOnInit(): void {
        this.callerService.isSmallScreen$().subscribe({
            next: (value) => {
                // TODO: do we wanna pipe() instead?
                if (value) {
                    this.stepperOrientation = 'vertical'
                } else {
                    this.stepperOrientation = 'horizontal'
                }
            },
        })

        this.accommodationFormGroup.valueChanges.subscribe({
            next: (value) => {
                // console.log('new accommodation value', value);
            },
        })

        this.accommodationFormGroup.get(['status'])?.valueChanges.subscribe({
            next: (value) => {
                console.log('new accommodation value', value)
            },
        })
    }

    accommodationPostFormData: FormData = new FormData()

    close(): void {
        this.createPostDialogRef.close()
    }

    /**
     * https://github.com/microsoft/TypeScript/issues/31816#issuecomment-646000392
     * https://stackblitz.com/edit/angular-14-image-upload-preview?file=src%2Fapp%2Fcomponents%2Fimage-upload%2Fimage-upload.component.ts
     * @param event file input
     */
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
        const reader = new FileReader()

        reader.onerror = function () {
            console.log('FileReader Err:', reader.error)
        }

        reader.onload = (e: any) => {
            console.log('e', e) // e.target.result
            this.accommodationImagesPreview.push({
                dataUrl: e.target.result,
                lastModified: file.lastModified,
                name: file.name,
                size: file.size,
            })
        }

        reader.readAsDataURL(file)
        this.accommodationPostFormData.set(
            `accommodationMedia-${file.lastModified}-${file.size}-${file.name}`,
            file,
        ) // setting individually so it's easier to delete.
    }

    populateFormData(): void {
        console.log(
            'available_rooms',
            Object.entries(
                this.accommodationFormGroup.get('available_rooms')?.value,
            ),
        )

        for (const field in this.accommodationFormGroup.controls) {
            // console.log(field, this.accommodationFormGroup.get(field))
            switch (field) {
                case 'available_rooms':
                    let _value = ''
                    Object.entries(
                        this.accommodationFormGroup.get(field)?.value,
                    ).forEach(([key, value], i) =>
                        _value = _value + (value ? `,${key.toString()}` : '')
                    )
                    this.accommodationPostFormData.set(field, _value.slice(1)) // slice the first comma
                    console.log('value rooms', _value.slice(1));
                    
                    break
                default:
                    this.accommodationPostFormData.set(
                        field,
                        this.accommodationFormGroup.get(field)?.value,
                    )
                    break
            }
        }

        console.log('this.accommodationPostFormData', this.accommodationPostFormData)
    }

    removePreviewImage(imageFileInput: HTMLInputElement, i: number) {
        this.accommodationImagesPreview.splice(i, 1)

        // clear the input. (incase the same file is deleted and selected again)
        imageFileInput.value = ''
    }

    submit(): void {
        // TODO: check for from validity

        console.log(
            'this.accommodationFormGroup.value',
            this.accommodationFormGroup.value,
        )
        this.populateFormData()

        // TODO: check that this.accommodationPostFormData is valid
        this.callerService.createNewAccommodationPost(this.accommodationPostFormData).subscribe({
          next: (res) => {
            console.log('res', res);
            if (res.status === 200) {
                this.accommodationPostFormData = new FormData() // reset
                this.createPostDialogRef.close()
                // TODO: return to calling component that is was successful?
            } else { // else show error message?
                
            }
          },
          error: (err) => {
            console.log('err', err);
          }
        })
    }
}
