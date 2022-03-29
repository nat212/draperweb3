import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ColumnAddEditComponent} from './column-add-edit.component';

describe('ColumnAddEditComponent', () => {
  let component: ColumnAddEditComponent;
  let fixture: ComponentFixture<ColumnAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
