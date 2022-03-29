import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild,} from '@angular/router';
import {TitleService} from '../services/title.service';

@Injectable({
  providedIn: 'root',
})
export class TitleGuard implements CanActivate, CanActivateChild {
  constructor(private readonly title: TitleService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.title.setTitle(route.data['title']);
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    return this.canActivate(childRoute);
  }
}
