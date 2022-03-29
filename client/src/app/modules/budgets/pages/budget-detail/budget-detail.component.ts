import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  toArray,
} from 'rxjs';
import {Budget} from '../../models/budget';
import {BudgetColumn} from '../../models/budget-column';
import {BudgetColumnService} from '../../services/budget-column.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ColumnAddEditComponent} from '../../modals/column-add-edit/column-add-edit.component';
import {BudgetService} from '../../services/budget.service';

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly columnService: BudgetColumnService,
    private readonly bsModal: BsModalService,
    private readonly router: Router,
    private readonly budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.refreshColumns$ = new Subject<void>();
    this.budget$ = new BehaviorSubject<Budget>(
      this.route.snapshot.data['budget']
    );
    this.route.data.pipe(map(({ budget }) => budget)).subscribe((budget) => {
      this.budget$.next(budget);
      this.budget = budget;
    });
    this.columns$ = this.budget$.pipe(
      filter((budget) => !!budget),
      switchMap((budget) =>
        concat(
          ...budget!.columns!.map((c) => this.columnService.getOne(c))
        ).pipe(toArray())
      )
    );
    this.refreshColumns$
      .pipe(switchMap(() => this.budgetService.getOne(this.budget.url!)))
      .subscribe((budget) => {
        this.budget$.next(budget);
        this.budget = budget;
      });
  }

  public addColumn(): void {
    const modalRef = this.bsModal.show(ColumnAddEditComponent);
    const _combine = combineLatest([modalRef.onHidden, modalRef.onHide]);
    _combine.pipe(take(1)).subscribe(() => {
      if (modalRef.content?.changed && modalRef.content?.column) {
        modalRef.content.column.budget = this.budget.url;
        this.columnService
          .createOne(modalRef.content.column)
          .subscribe(() => this.refreshColumns$.next());
      }
    });
  }

  public removeColumn(column: BudgetColumn) {
    this.columnService.removeOne(column).subscribe(() => {
      this.refreshColumns$.next();
    });
  }
}
