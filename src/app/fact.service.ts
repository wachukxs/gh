import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fact } from './feed/feed.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactService {

  constructor(private http: HttpClient) { }
  //
  getRandomFact(): Observable<object | Fact[]> {
    const month = Math.floor(Math.random() * 11) + 1;
    let maxDay = 30;
    if (month === 2) {
      maxDay = 27;
    } else if ([4, 6, 9, 11].includes(month)) {
      maxDay = 29;
    }
    const day = Math.floor(Math.random() * maxDay) + 1;

    // `https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444`
    // 'http://numbersapi.com/${month}/${day}/date?json'


    return this.http.get<Fact[] | object>(
      'https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444'
      /* ,
      {
        headers:
        {
          'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
          , 'Access-Control-Allow-Headers': '*'
        }
      } */);
  }
}

// sample flight response
// {"time":1458564121,"states":[["3c6444","DLH9LF  ","Germany",1458564120,1458564120,6.1546,50.1964,9639.3,false,232.88,98.26,4.55,null,9547.86,"1000",false,0]]}
