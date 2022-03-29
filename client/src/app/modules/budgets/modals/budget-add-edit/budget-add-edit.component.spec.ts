import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BudgetAddEditComponent} from './budget-add-edit.component';

describe('BudgetAddEditComponent', () => {
  let component: BudgetAddEditComponent;
  let fixture: ComponentFixture<BudgetAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
