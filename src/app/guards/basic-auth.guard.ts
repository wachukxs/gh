import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CallerService } from '../services/caller.service';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthGuard implements CanActivate {
  constructor(private router: Router, private callerService: CallerService) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('authenticating');

      if (localStorage.getItem('online-corper')) {
  
        let foundData = JSON.parse(
          new String(localStorage.getItem('online-corper')).toString()
        );
        if (foundData?.id && foundData?.statecode && this.callerService.corpMemberStateCodeRegex.test(foundData?.statecode)) { // and check state code
          console.log('authenticated');
        
          return true;
        } else {
          this.callerService.showNotification("Session Expired. Login.", undefined, "OK" , "bottom")
          return this.router.navigate(['/login'])
        }
        
      } else {
        console.log('not authenticated');
  
        this.callerService.showNotification("Session Expired. Login.", undefined, "OK" , "bottom")
        return this.router.navigate(['/login'])
      }
  }
  
}
