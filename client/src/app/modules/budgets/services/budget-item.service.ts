import {Injectable} from '@angular/core';
import {EntityService, IFilter} from '../../../lib/entity-service';
import {BudgetItem, IBudgetItem} from '../models/budget-item';
import {HttpClient} from '@angular/common/http';

interface IBudgetItemFilters extends IFilter {
  column?: string | number;
  column__budget?: string | number;
  category?: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetItemService extends EntityService<IBudgetItem, BudgetItem, IBudgetItemFilters> {
  protected readonly entityClass = BudgetItem;
  protected readonly url = '/api/budgets/items/';

  constructor(http: HttpClient) {
    super(http);
  }
}
