import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteContainerComponent } from './autocomplete-container.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteContainerComponent;
  let fixture: ComponentFixture<AutocompleteContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
