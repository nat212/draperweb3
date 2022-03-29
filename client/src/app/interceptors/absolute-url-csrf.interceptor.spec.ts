import {TestBed} from '@angular/core/testing';

import {AbsoluteUrlCsrfInterceptor} from './absolute-url-csrf.interceptor';

describe('AbsoluteUrlCsrfInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AbsoluteUrlCsrfInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AbsoluteUrlCsrfInterceptor = TestBed.inject(AbsoluteUrlCsrfInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
