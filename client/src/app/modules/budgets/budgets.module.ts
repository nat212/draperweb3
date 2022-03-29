import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BudgetsRoutingModule} from './budgets-routing.module';
import {BudgetListComponent} from './pages/budget-list/budget-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {BudgetAddEditComponent} from './modals/budget-add-edit/budget-add-edit.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BudgetDetailComponent} from './pages/budget-detail/budget-detail.component';
import {TabsModule} from "ngx-bootstrap/tabs";
import {ColumnAddEditComponent} from './modals/column-add-edit/column-add-edit.component';

@NgModule({
  declarations: [
    BudgetListComponent,
    BudgetAddEditComponent,
    BudgetDetailComponent,
    ColumnAddEditComponent,
  ],
  imports: [
    CommonModule,
    BudgetsRoutingModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    CollapseModule,
    BsDropdownModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class BudgetsModule {}
