import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CallerService extends BaseService {

  constructor() {
    super()
  }
}
