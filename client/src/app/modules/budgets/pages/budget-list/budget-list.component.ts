import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { combineLatest, debounceTime, Observable, pluck, startWith, Subject, switchMap, tap } from 'rxjs';
import { Budget } from '../../models/budget';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BudgetAddEditComponent } from '../../modals/budget-add-edit/budget-add-edit.component';
import { AlertService } from '../../../../services/alert.service';
import { PaginatedResponse } from '../../../../lib/entity-service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CategoryAddEditComponent } from '../../modals/category-add-edit/category-add-edit.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss'],
})
export class BudgetListComponent implements OnInit {
  public budgets$!: Observable<Budget[]>;
  public budgetResponse$!: Observable<PaginatedResponse<Budget>>;
  public searchControl!: UntypedFormControl;
  public filterForm!: UntypedFormGroup;
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

  private _page = 1;
  private page$!: Subject<number>;

  public get page(): number {
    return this._page;
  }

  public set page(page: number) {
    const pageChanged = this._page !== page;
    this._page = page;
    if (pageChanged) {
      this.page$.next(this._page);
    }
  }

  public categoryResponse$!: Observable<PaginatedResponse<Category>>;
  public categories$!: Observable<Category[]>;
  public categorySearchControl!: UntypedFormControl;

  public categoryLoading = false;
  private categoryRefresh$!: Subject<void>;

  private _categoryPage = 1;
  private categoryPage$!: Subject<number>;

  public get categoryPage(): number {
    return this._categoryPage;
  }

  public set categoryPage(page: number) {
    const pageChanged = this._categoryPage !== page;
    this._categoryPage = page;
    if (pageChanged) {
      this.categoryPage$.next(this._categoryPage);
    }
  }

  constructor(
    private readonly service: BudgetService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly bsModalService: BsModalService,
    private readonly alert: AlertService,
    private readonly categoryService: CategoryService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.refresh$ = new Subject<void>();
    this.page$ = new Subject<number>();
    this.searchControl = new UntypedFormControl('');
    this.filterForm = this.formBuilder.group({
      year: [null],
      date: [null],
    });
    this.budgetResponse$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), debounceTime(500)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value), debounceTime(500)),
      this.page$.pipe(startWith(this.page)),
      this.refresh$.pipe(startWith(null)),
    ]).pipe(
      tap(() => (this.loading = true)),
      switchMap(([search, filters, page, _]) => this.service.getManyPaginated(filters, search, { page })),
      tap(() => (this.loading = false)),
    );
    this.budgets$ = this.budgetResponse$.pipe(pluck('results'));

    this.categorySearchControl = new UntypedFormControl('');
    this.categoryPage$ = new Subject<number>();
    this.categoryRefresh$ = new Subject();
    this.categoryResponse$ = combineLatest([
      this.categorySearchControl.valueChanges.pipe(startWith(this.categorySearchControl.value), debounceTime(500)),
      this.categoryPage$.pipe(startWith(this.categoryPage)),
      this.categoryRefresh$.pipe(startWith(null)),
    ]).pipe(
      tap(() => (this.categoryLoading = true)),
      switchMap(([search, page, _]) => this.categoryService.getManyPaginated({}, search, { page })),
      tap(() => (this.categoryLoading = false)),
    );
    this.categories$ = this.categoryResponse$.pipe(pluck('results'));
  }

  public addBudget(): void {
    this.alert.openModal(this.bsModalService, BudgetAddEditComponent, {}, ['changed', 'model']).subscribe(({ changed, model }) => {
      if (changed && model) {
        this.service.createOne(model).subscribe(() => this.refresh$.next());
      }
    });
  }

  public editBudget(budget: Budget): void {
    this.alert
      .openModal(this.bsModalService, BudgetAddEditComponent, { model: budget }, ['changed', 'model'])
      .subscribe(({ changed, model }) => {
        if (changed && model) {
          this.service.updateOne(model).subscribe(() => this.refresh$.next());
        }
      });
  }

  public addCategory(): void {
    this.alert.openModal(this.bsModalService, CategoryAddEditComponent, {}, ['changed', 'model']).subscribe(({ changed, model }) => {
      if (changed && model) {
        this.categoryService.createOne(model).subscribe(() => this.categoryRefresh$.next());
      }
    });
  }

  public editCategory(category: Category): void {
    this.alert
      .openModal(this.bsModalService, CategoryAddEditComponent, { model: category }, ['changed', 'model', 'deleted'])
      .subscribe(({ changed, model, deleted }) => {
        if (deleted && model) {
          this.alert
            .confirm(this.bsModalService, 'Delete category', `Are you sure you wish to delete the category ${category.name}?`)
            .subscribe((result) => {
              if (result) {
                this.categoryService.removeOne(model).subscribe(() => this.categoryRefresh$.next());
              }
            });
        } else if (changed && model) {
          this.categoryService.updateOne(model).subscribe(() => this.categoryRefresh$.next());
        }
      });
  }

  removeBudget(budget: Budget) {
    this.alert
      .confirm(this.bsModalService, 'Delete Budget', `Are you sure you wish to delete ${budget.name}? All associated data will be lost.`)
      .subscribe((result) => {
        if (result) {
          this.service.removeOne(budget).subscribe(() => {
            this.refresh$.next();
          });
        }
      });
  }

  importBudget(budget: Budget) {
    this.alert.openModal(this.bsModalService, BudgetAddEditComponent, undefined, ['changed', 'model']).subscribe(({ changed, model }) => {
      console.log(changed, model);
      if (changed && model) {
        this.service.createOne(model).subscribe((added) => {
          this.router.navigate([added.id, 'import'], { queryParams: { from: budget.id }, relativeTo: this.route });
        });
      }
    });
  }
}
