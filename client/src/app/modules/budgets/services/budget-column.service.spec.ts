import {TestBed} from '@angular/core/testing';

import {BudgetColumnService} from './budget-column.service';

describe('BudgetColumnService', () => {
  let service: BudgetColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
