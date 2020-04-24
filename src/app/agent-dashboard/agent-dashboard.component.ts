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
      no: new FormControl('')
    }, [
        Validators.required,
        Validators.minLength(3)
      ])
  });

  postHouse() {
    console.log('posting');

    this.httpClient.post('http://localhost:8083/greenhomes/php/api/houses/create.php', this.propertyForm.value).subscribe((res: any) => {
      console.log('post good response', res);
    }, (err: any) => {
      console.log('post err response', err);
    });
  }

}
