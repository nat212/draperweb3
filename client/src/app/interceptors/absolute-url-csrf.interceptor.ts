import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class AbsoluteUrlCsrfInterceptor implements HttpInterceptor {
  constructor(private readonly tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenExtractor.getToken() as string;
    let newReq = request.clone();
    if (
      request.url.startsWith('http://') ||
      request.url.startsWith('https://')
    ) {
      newReq = request.clone({
        headers: request.headers.set(environment.xsrfHeaderName, token),
      });
    }
    return next.handle(newReq);
  }
}
