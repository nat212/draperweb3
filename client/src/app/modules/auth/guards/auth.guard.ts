import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree,} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private getUrlTree(path: string): UrlTree {
    return this.router.parseUrl(path);
  }

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const reqAuth = route.data['loggedIn'] ?? true;
    return this.auth
      .isAuthenticated()
      .pipe(
        map((loggedIn) =>
          reqAuth
            ? loggedIn || this.getUrlTree('/login')
            : !loggedIn || this.getUrlTree('/')
        )
      );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute);
  }
}
