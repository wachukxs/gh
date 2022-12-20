import { Component, OnInit, isDevMode } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CanExit } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit, CanExit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      console.log('what\'s matches:', matches);

      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  you: any;

  dev = isDevMode();

  theAgent: string = ''

  baseUrl: string =  environment.baseurl;

  houses: Array<any> = []; // get data type of houses
  houseImages: Array<any> = []; //
  houseTypes: Array<string> = [
    'Duplex', 'Bongalow', 'Flat', 'Skyscrapper', 'Dungeon', 'Castle'
  ];

  constructor(private snackBar: MatSnackBar,
              private httpClient: HttpClient,
              private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              private formBuilder: FormBuilder) {

                let agnt = sessionStorage.getItem('green-homes-agent')
                if (agnt) {
                  this.theAgent = agnt
                }
              }

  propertyForm = new FormGroup({
    by: new FormControl(JSON.parse(this.theAgent).resource_uri),
    bedrooms: new FormControl(''),
    kitchen: new FormControl(''),
    toilet: new FormControl(''),
    bathrooms: new FormControl(''),
    // graphics: new FormControl('', [Validators.required]),
    house_type: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    street: new FormControl(''),
    city_or_town: new FormControl(''),
    state: new FormControl(''),
    number: new FormControl('')
  }, [Validators.required]);

  houseFormData = new FormData();

  step = 0;

  loadingHouseDataTries = 0;

  folders: any[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: any[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit() {
    this.you = JSON.parse(this.theAgent);
    // this.propertyForm.controls.by.patchValue

    this.loadHousesData();
  }

  loadHousesData() {
    this.httpClient.get(`${environment.baseurl}/api/v1/houses/`).subscribe((res: any) => {
      this.houses = res.objects;
      // stop the loader
      this.httpClient.get(`${environment.baseurl}/api/v1/media/`).subscribe((resp: any) => {
        this.houseImages = resp.objects;
        console.log(this.houseImages); // this.houseImages.place == this.houses.resource_uri
      });
      console.log(this.houses);
    }, err => {
      // tell them we couldn't load houses. try again.
      // after 5 tries, we tell them sth's really up.
      // then probably give them the option of tryin again themselves
      if (this.loadingHouseDataTries < 6) {
        this.loadHousesData();
        this.loadingHouseDataTries++ ;
      } else {
      }
    });
  }

  aHouseImages(houseURI: string): Array<any> {
    return this.houseImages.filter(hI => hI.place === houseURI);
  }

  deleteHouseImage(imageURI: string): void {
    this.httpClient.delete(`${environment.baseurl}${imageURI}`).subscribe((res: any) => {
      // good, remove the image, pop it out from array
      this.houseImages = this.houseImages.filter(item => item.images !== imageURI);
      this.snackBar.open('Image successfully deleted', 'Close', {
        duration: 4000,
      });
    }, err => {
      // bad, tell them to try again
      this.snackBar.open('We couldn\'t delete that', 'Try again', {
        duration: 4000,
      });
    });
  }

  houseMedia(event: any, houseID: number): void {
    console.log('house media', event.target.files);

    this.houseFormData.append('images', event.target.files[0]);
    this.houseFormData.append('place', `/api/v1/houses/${houseID}/`);

    // this.propertyForm.controls.graphics.setValue(event.target.files); // not files[0]
    /* for (let i = 0, numFiles = event.target.files.length; i < numFiles; i++) {
      // do sth with the files
      const file = event.target.files[i];
    } */
  }

  updateHouseInfo(): void { // media files goes to http://localhost:8000/media/images/15.jpg
    this.httpClient.post(`${environment.baseurl}/api/v1/media/`, this.houseFormData)
      .subscribe((res: any) => {
        console.log('good?', res);
        this.houseImages.push(res); // update the current list
        this.houseFormData = new FormData(); // reset if successful
        // reset the input file form
        // add the picture to the house
        this.propertyForm.reset(); // reset the form
        this.snackBar.open('Listing successfully updated', 'Close', {
          duration: 4000,
        });
    }, (err: any) => {
      console.error('update house err', err);
      this.snackBar.open('Try again, something went wrong', 'Close', {
        duration: 4000,
      });
    }, () => {
      // console.log('we\'re done did try.');
    });
  }

  postHouse() {
    console.log('posting', this.propertyForm.value);

    // convert formControl to formData
    /* Object.entries(this.propertyForm.value).forEach((value: [string, string | Blob], index, arr) => {
      this.houseFormData.append(value[0], value[1]);
    }); */

    // previously 'http://localhost:8083/greenhomes/php/api/houses/create.php'
    this.httpClient.post(`${environment.baseurl}/api/v1/houses/`, this.propertyForm.value/* this.houseFormData */).subscribe((res: any) => {
      console.log('post good response', res);
      this.houses.push(res);
      // if they clicked save draft, the post form like that and reset houseFormData variable
    }, (err: any) => {
      console.log('post err response', err);
      console.warn(err.error.error_message);
    });
  }

  canDeactivate(): Promise<any> | boolean {
    if (this.houseFormData.has('images')) { // means there's a picture to post/update
      return new Promise((resolve, reject) => {
        const confirm = this.dialog.open(ExitConfirmationDialogComponent, {
          data: {
            message: 'unsaved changes',
            username: 'u-name'
          }
        });
        confirm.afterClosed().subscribe((res) => {
          if (res === 'wait') {
            resolve(false);
          } else {
            resolve(true);
          }
        }, (err) => { // might never get here, to err
          console.log(`exit confirmation Dialog error: ${err}`);
          resolve(false);
        });
      });
    } else {
      return true;
    }
  }

}
