import { Injectable } from '@angular/core';
import { ActivatedRoute,
        ActivatedRouteSnapshot,
        CanDeactivate,
        CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * TODO:
 * we should redirect the user to the url they wanted to go to, ... after they login
 * This might be a duplicate service. The basic auth route guard already does this.
 */
// from https://www.agiratech.com/how-to-use-angular-route-guards-angular-authentication/
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate, CanLoad {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkToken();
  }

  canLoad(route: Route): boolean {
    return this.checkToken();
  }

  checkToken() {
    if (localStorage.getItem('online-corper')) {
      return true;
    } else {
        // this.router.navigateByUrl('/login');
        this.router.navigate(['/login']);
        return false;
    }
  }
}

@Injectable()
export class CanExitGuard implements CanDeactivate<CanExit> {
 canDeactivate(component: CanExit) {
   if (component.canDeactivate) {
     return component.canDeactivate();
   }
   return true;
 }
}

export interface CanExit {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
