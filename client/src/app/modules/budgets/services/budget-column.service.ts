import { Injectable } from '@angular/core';
import { EntityService, IFilter } from '../../../lib/entity-service';
import { BudgetColumn, IBudgetColumn, IColumnSummary } from '../models/budget-column';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IBudgetColumnFilters extends IFilter {
  budget?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetColumnService extends EntityService<IBudgetColumn, BudgetColumn, IBudgetColumnFilters> {
  protected readonly url = '/api/budgets/columns/';
  protected readonly entityClass = BudgetColumn;

  constructor(http: HttpClient) {
    super(http);
  }

  public getSummary(column: BudgetColumn): Observable<IColumnSummary> {
    if (!column.summary) {
      throw new Error('Column has no summary');
    }
    return this.http.get<IColumnSummary>(column.summary);
  }
}
