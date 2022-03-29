import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './pages/login/login.component';
import {AuthenticatedComponent} from './pages/authenticated/authenticated.component';
import {AuthGuard} from './modules/auth/guards/auth.guard';
import {TitleGuard} from './guards/title.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    canActivate: [AuthGuard],
    canActivateChild: [TitleGuard],
    data: { loggedIn: true },
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'budgets',
        loadChildren: () =>
          import('./modules/budgets/budgets.module').then(
            (m) => m.BudgetsModule
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { loggedIn: false, title: 'Login' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
