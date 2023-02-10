import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * TODO: This is to verify the app is running in local-host,
 * so it never shows in prod.
 */
@Injectable({
  providedIn: 'root'
})
export class InLocalGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (window.location.hostname === 'localhost') {
      return true;
    } else {
      return false;
    }
  }
  
}
