import {Component, OnInit} from '@angular/core';
import {BudgetService} from '../../services/budget.service';
import {combineLatest, debounceTime, Observable, startWith, Subject, switchMap, tap} from 'rxjs';
import {Budget} from '../../models/budget';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BsDaterangepickerConfig} from 'ngx-bootstrap/datepicker';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BudgetAddEditComponent} from '../../modals/budget-add-edit/budget-add-edit.component';
import {AlertService} from '../../../../services/alert.service';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss'],
})
export class BudgetListComponent implements OnInit {
  public budgets$!: Observable<Budget[]>;
  public searchControl!: FormControl;
  public filterForm!: FormGroup;
  public filtersCollapsed = true;
  public loading = false;

  private refresh$!: Subject<void>;

  public rangePickerConfig: Partial<BsDaterangepickerConfig> = {
    adaptivePosition: true,
    showClearButton: true,
    clearButtonLabel: 'Clear',
    dateInputFormat: 'Do MMM YYYY',
    rangeInputFormat: 'Do MMM YYYY',
  };

  constructor(
    private readonly service: BudgetService,
    private readonly formBuilder: FormBuilder,
    private readonly bsModalService: BsModalService,
    private readonly alert: AlertService,
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.refresh$ = new Subject<void>();
    this.searchControl = new FormControl('');
    this.filterForm = this.formBuilder.group({
      year: [null],
      date: [null],
    });
    this.budgets$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
      this.refresh$.pipe(startWith(null)),
    ]).pipe(
      debounceTime(500),
      tap(() => (this.loading = true)),
      switchMap(([search, filters, _]) => this.service.getMany(filters, search)),
      tap(() => (this.loading = false)),
    );
  }

  public addBudget(): void {
    this.alert.openModal(this.bsModalService, BudgetAddEditComponent, {}, ['changed', 'model']).subscribe(({
                                                                                                             changed,
                                                                                                             model
                                                                                                           }) => {
      if (changed && model) {
        this.service.createOne(model).subscribe(() => this.refresh$.next());
      }
    });
  }

  public editBudget(budget: Budget): void {
    this.alert
      .openModal(this.bsModalService, BudgetAddEditComponent, {model: budget}, ['changed', 'model'])
      .subscribe(({changed, model}) => {
        if (changed && model) {
          this.service.updateOne(model).subscribe(() => this.refresh$.next());
        }
      });
  }
}
