import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BudgetListComponent} from './pages/budget-list/budget-list.component';
import {BudgetDetailComponent} from './pages/budget-detail/budget-detail.component';
import {BudgetResolver} from './resolvers/budget.resolver';

const routes: Routes = [
  { path: '', component: BudgetListComponent, data: { title: 'Budgets' } },
  {
    path: ':id',
    component: BudgetDetailComponent,
    resolve: { budget: BudgetResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetsRoutingModule {}
