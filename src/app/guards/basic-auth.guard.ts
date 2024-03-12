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

      const corpMemberLocal = localStorage.getItem('online-corper')
      if (corpMemberLocal) {
        const foundData = JSON.parse(corpMemberLocal);
        /**
         * we don't need only corp members from current year and last year.
         */
        if (foundData?.state_code && this.callerService.corpMemberStateCodeRegex.test(foundData?.state_code)) {
          console.log('authenticated');
        
          return true;
        } else {
          console.log('no statecode or invalid statecode');
          this.callerService.showNotification("State code not found or invalid. Sign up.", undefined, "OK" , "bottom")
          return this.router.navigate(['/signup'])
        }
        
      } else {
        console.log('not authenticated');
  
        this.callerService.showNotification("Session Expired. Login.", undefined, "OK" , "bottom")
        return this.router.navigate(['/login'])
      }
  }
  
}
