import {TestBed} from '@angular/core/testing';

import {BudgetItemService} from './budget-item.service';

describe('BudgetItem', () => {
  let service: BudgetItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
