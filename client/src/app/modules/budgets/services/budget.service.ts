import {Injectable} from '@angular/core';
import {EntityService, IFilter} from "../../../lib/entity-service";
import {Budget, IBudget} from "../models/budget";
import {HttpClient} from "@angular/common/http";

interface IBudgetFilter extends IFilter {
  year?: number;
  end_date?: Date[];
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService extends EntityService<IBudget, Budget, IBudgetFilter> {
  protected readonly entityClass = Budget;
  protected readonly url = '/api/budgets/budgets/';

  constructor(http: HttpClient) {
    super(http);
  }
}
