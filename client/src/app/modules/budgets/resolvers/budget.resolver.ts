import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {BudgetService} from '../services/budget.service';
import {Budget} from '../models/budget';
import {TitleService} from '../../../services/title.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetResolver implements Resolve<Budget> {
  constructor(
    private readonly service: BudgetService,
    private readonly title: TitleService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Budget> {
    return this.service
      .getOne(parseInt(route.params['id'], 10))
      .pipe(tap((budget) => this.title.setTitle(`Budgets | ${budget.name}`)));
  }
}
