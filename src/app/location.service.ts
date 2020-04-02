import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  /**
   * from https://stackoverflow.com/questions/51628568/get-coordinates-of-current-location-in-angular
   */

  getPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        response => {
          resolve(response/* { lng: response.coords.longitude, lat: response.coords.latitude } */);
        },
        error => {
          reject(error);
        });
    });
  }

  /* watchPosition(): Promise<any> { // take arguments of how often to watch?
    return new Promise((resolve, reject) => {

      navigator.geolocation.watchPosition(
        response => {
          resolve({ lng: response.coords.longitude, lat: response.coords.latitude });
        },
        error => {
          reject(error);
        });
    });
  } */

  /**
   * from https://angular.io/guide/observables
   * and https://stackoverflow.com/a/44880385/9259701
   */

  watchPosition(): Observable<Position> { // take arguments of how often to watch?
    return new Observable(observer => {

      let watchId: number;

      const onSuccess: PositionCallback = (pos: Position) => {
          observer.next(pos);
      };

      const onError: PositionErrorCallback = (error) => {
          observer.error(error);
      };

      const options: PositionOptions = {};

      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
      } else {
        observer.error('Geolocation not available');
      }

      return {
        unsubscribe() {
          navigator.geolocation.clearWatch(watchId);
          observer.complete();
        }
      };
  });
  }

}
