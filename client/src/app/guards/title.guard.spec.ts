import {TestBed} from '@angular/core/testing';

import {TitleGuard} from './title.guard';

describe('TitleGuard', () => {
  let guard: TitleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TitleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
