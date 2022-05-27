import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, AlertModule],
})
export class DashboardModule {}
