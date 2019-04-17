import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class AdminViewRouteGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log("in admin user guard service");

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else if(Cookie.get('typeOfUser') !== 'Admin'){

      this.router.navigate(['/']);
      return false;

    } else {

      return true;
    }

  }
}
