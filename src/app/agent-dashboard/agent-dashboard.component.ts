import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent {
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

  houseTypes: Array<string> = [
    'Duplex', 'Bongalow', 'Flat', 'Skyscrapper', 'Dungeon', 'Castle'
  ];

  constructor(private httpClient: HttpClient, private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder) {}

  propertyForm = new FormGroup({
    specs: new FormGroup({
      bedrooms: new FormControl(''),
      kitchen: new FormControl(''),
      toilet: new FormControl(''),
      bathrooms: new FormControl('')
    }, [
        Validators.required
      ]),
    media: new FormControl('', [Validators.required]),
    houseType: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      lga: new FormControl('')
    }, [
        Validators.required,
        Validators.minLength(3)
      ])
  });

  houseFormData = new FormData();

  houseMedia(event): void {
    console.log('house media', event.target.files);

    // this.houseFormData.append('media', event.target.files[0]);
    this.propertyForm.controls.media.setValue(event.target.files[0]);
    for (let i = 0, numFiles = event.target.files.length; i < numFiles; i++) {
      const file = event.target.files[i];
    }
  }

  postHouse() {
    console.log('posting');

    // convert formControl to formData
    Object.entries(this.propertyForm.value).forEach((value: [string, string | Blob], index, arr) => {
      this.houseFormData.append(value[0], value[1]);
    });

    this.httpClient.post('http://localhost:8083/greenhomes/php/api/houses/create.php', this.houseFormData).subscribe((res: any) => {
      console.log('post good response', res);
      this.houseFormData = new FormData(); // reset

      // if they clicked save draft, the post form like that and reset houseFormData variable
    }, (err: any) => {
      console.log('post err response', err);
    });
  }

}
