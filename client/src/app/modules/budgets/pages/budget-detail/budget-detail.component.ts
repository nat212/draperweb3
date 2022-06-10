import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { Budget } from '../../models/budget';
import { BudgetColumn } from '../../models/budget-column';
import { BudgetColumnService } from '../../services/budget-column.service';
import { ColumnAddEditComponent } from '../../modals/column-add-edit/column-add-edit.component';
import { BudgetService } from '../../services/budget.service';
import { AlertService } from '../../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-budget-detail',
  templateUrl: './budget-detail.component.html',
  styleUrls: ['./budget-detail.component.scss'],
})
export class BudgetDetailComponent implements OnInit {
  private budget!: Budget;
  public budget$!: BehaviorSubject<Budget>;
  public columns$!: Observable<BudgetColumn[]>;
  public refreshColumns$!: Subject<void>;
  public loading!: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly columnService: BudgetColumnService,
    private readonly router: Router,
    private readonly budgetService: BudgetService,
    private readonly alert: AlertService,
    private readonly modal: BsModalService,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.refreshColumns$ = new Subject<void>();
    this.budget$ = new BehaviorSubject<Budget>(this.route.snapshot.data['budget']);
    this.route.data.pipe(map(({ budget }) => budget)).subscribe((budget) => {
      this.budget$.next(budget);
      this.budget = budget;
    });
    this.columns$ = this.budget$.pipe(
      filter((budget) => !!budget),
      map((budget) => budget.columns!),
      tap(() => {
        this.loading = false;
        this.cdRef.detectChanges();
      }),
    );
    this.refreshColumns$
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(() => this.budgetService.getOne(this.budget.url)),
      )
      .subscribe((budget) => {
        this.budget$.next(budget);
        this.budget = budget;
      });
  }

  public addColumn(): void {
    this.alert.openModal(this.modal, ColumnAddEditComponent, {}, ['changed', 'model']).subscribe(({ changed, model }) => {
      if (changed && model) {
        this.loading = true;
        model.budget = this.budget.url;
        this.columnService.createOne(model).subscribe(() => this.refreshColumns$.next());
      }
    });
  }

  public removeColumn(column: BudgetColumn) {
    this.alert
      .confirm(this.modal, 'Remove Column', `Are you sure you wish to remove the budget column ${column.name}?`)
      .subscribe((result) => {
        if (result) {
          this.loading = true;
          this.columnService.removeOne(column).subscribe(() => {
            this.refreshColumns$.next();
          });
        }
      });
    return false;
  }
}
