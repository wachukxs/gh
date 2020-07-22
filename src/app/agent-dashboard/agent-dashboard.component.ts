import { Component, OnInit, isDevMode } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CanExit } from '../services/authentication.service';

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

  houses: any;

  houseTypes: Array<string> = [
    'Duplex', 'Bongalow', 'Flat', 'Skyscrapper', 'Dungeon', 'Castle'
  ];

  constructor(private httpClient: HttpClient,
              private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              private formBuilder: FormBuilder) {}

  propertyForm = new FormGroup({
    by: new FormControl(JSON.parse(sessionStorage.getItem('green-homes-agent')).resource_uri),
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
    this.you = JSON.parse(sessionStorage.getItem('green-homes-agent'));
    // this.propertyForm.controls.by.patchValue

    this.httpClient.get(`${environment.baseurl}/api/v1/houses/`).subscribe((res: any) => {
      this.houses = res.objects;
      console.log(this.houses);
    });
  }

  houseMedia(event, houseID: number): void {
    console.log('house media', event.target.files);

    this.houseFormData.append('images', event.target.files);
    this.houseFormData.append('place', `/api/v1/houses/${houseID}/`);

    // this.propertyForm.controls.graphics.setValue(event.target.files); // not files[0]
    /* for (let i = 0, numFiles = event.target.files.length; i < numFiles; i++) {
      // do sth with the files
      const file = event.target.files[i];
    } */
  }

  updateHouseInfo(): void {
    this.httpClient.post(`${environment.baseurl}/api/v1/media/`, this.houseFormData)
      .subscribe((res: any) => {
        console.log('good?', res);

        this.houseFormData = new FormData(); // reset if successful
    }, (err: any) => {
      console.error('update house err', err);
    }, () => {
      console.log('we\'re done did try.');
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
