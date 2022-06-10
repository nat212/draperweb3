import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetImportComponent } from './budget-import.component';

describe('BudgetImportComponent', () => {
  let component: BudgetImportComponent;
  let fixture: ComponentFixture<BudgetImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
