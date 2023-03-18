import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { CallerService } from '../services/caller.service'

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
export class CreateNewSaleComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private createPostDialogRef: MatDialogRef<CreateNewSaleComponent>,
        private callerService: CallerService,
    ) {}

    salePostFormData: FormData = new FormData()

    saleImagesPreview: Array<ImagePreview> = []

    saleFormGroup: FormGroup = new FormGroup({
        price: new FormControl('', [Validators.required]), // TODO: min should be 1
        minPrice: new FormControl(null), // TODO: can't be more than price.
        isItemNegotiable: new FormControl(false),
        text: new FormControl(''),
        itemname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })

    ngOnInit(): void {
        this.saleFormGroup
            .get(['isItemNegotiable'])
            ?.valueChanges.subscribe((value: boolean) => {
                console.log('new isItemNegotiable value', value)
                if (value) {
                    this.saleFormGroup
                        .get(['minPrice'])
                        ?.setValidators([Validators.required])
                } else {
                    this.saleFormGroup
                        .get(['minPrice'])
                        ?.removeValidators([Validators.required])
                }
                this.saleFormGroup.get(['minPrice'])?.updateValueAndValidity()
            })
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
            `saleMedia-${file.lastModified}-${file.size}-${file.name}`,
            file,
        ) // setting individually so it's easier to delete.
    }

    submit(): void {
      if (this.saleFormGroup.valid) {
        console.log('submitting...');
        this.populateFormData()

        // TODO: check that this.createNewSalePost is valid
        this.callerService.createNewSalePost(this.salePostFormData).subscribe({
            next: (res) => {
              console.log('res', res);
              this.salePostFormData = new FormData() // reset
            },
            error: (err) => {
              console.log('err', err);
            }
          })
        
      } else {
        console.log('form value', this.saleFormGroup.value);
        
        this.saleFormGroup.markAllAsTouched()
        this.saleFormGroup.updateValueAndValidity()
      }
    }

    close(): void {
        this.createPostDialogRef.close()
    }
}
