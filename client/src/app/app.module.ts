import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { AuthenticatedComponent } from './pages/authenticated/authenticated.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AbsoluteUrlCsrfInterceptor } from './interceptors/absolute-url-csrf.interceptor';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { AppFormsModule } from './modules/forms/forms.module';
import { InstallService } from './services/install.service';

@NgModule({
  declarations: [AppComponent, LoginComponent, AuthenticatedComponent, ConfirmComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ButtonsModule.forRoot(),
    HttpClientXsrfModule.withOptions({
      cookieName: environment.xsrfCookieName,
      headerName: environment.xsrfHeaderName,
    }),
    AppFormsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AbsoluteUrlCsrfInterceptor, multi: true }, InstallService],
  bootstrap: [AppComponent],
})
export class AppModule {}
