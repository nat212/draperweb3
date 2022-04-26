import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BudgetColumn, IColumnSummary } from '../../models/budget-column';
import { BudgetItemService } from '../../services/budget-item.service';
import { BehaviorSubject, concat, Observable, ReplaySubject, Subject, tap, toArray } from 'rxjs';
import { BudgetItem } from '../../models/budget-item';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../../../services/alert.service';
import { ItemAddEditComponent } from '../../modals/item-add-edit/item-add-edit.component';
import { BudgetColumnService } from '../../services/budget-column.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-column-detail',
  templateUrl: './column-detail.component.html',
  styleUrls: ['./column-detail.component.scss'],
})
export class ColumnDetailComponent implements OnInit {
  @Input() column!: BudgetColumn;

  public items$!: BehaviorSubject<BudgetItem[]>;
  public loading = false;
  public summary$!: ReplaySubject<IColumnSummary>;

  private categories!: Map<string, Subject<Category>>;

  constructor(
    private readonly itemService: BudgetItemService,
    private readonly modalService: BsModalService,
    private readonly alert: AlertService,
    private readonly columnService: BudgetColumnService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categories = new Map<string, Subject<Category>>();
    this.summary$ = new ReplaySubject<IColumnSummary>(1);
    this.items$ = new BehaviorSubject<BudgetItem[]>([]);
    this.setItems(this.column.items);
    this.setSummary();
  }

  private setSummary() {
    this.columnService.getSummary(this.column).subscribe((summary) => {
      this.summary$.next(summary);
    });
  }

  private setItems(items: string[]): void {
    this.loading = true;
    concat(...items.map((item) => this.itemService.getOne(item)))
      .pipe(
        toArray(),
        tap(() => {
          this.loading = false;
          this.cdRef.detectChanges();
        }),
      )
      .subscribe((results) => {
        this.items$.next(results);
      });
  }

  private refresh(): void {
    this.columnService.getOne(this.column.url).subscribe((column) => {
      this.setItems(column.items);
    });
    this.setSummary();
  }

  public addItem(): void {
    this.alert.openModal(this.modalService, ItemAddEditComponent, {}, ['changed', 'model']).subscribe(({ changed, model }) => {
      if (changed && model) {
        this.loading = true;
        model.column = this.column.url;
        this.itemService.createOne(model).subscribe(() => {
          this.refresh();
        });
      }
    });
  }

  public editItem(item: BudgetItem): void {
    this.alert
      .openModal(this.modalService, ItemAddEditComponent, { model: item }, ['changed', 'model', 'deleted'])
      .subscribe(({ changed, model, deleted }) => {
        if (deleted) {
          this.alert
            .confirm(this.modalService, 'Delete Item', `Are you sure you wish to delete the item ${item.name}?`)
            .subscribe((confirmed) => {
              if (confirmed) {
                this.loading = true;
                this.itemService.removeOne(item).subscribe(() => {
                  this.refresh();
                });
              }
            });
        } else if (changed && model) {
          this.loading = true;
          this.itemService.updateOne(model).subscribe(() => {
            this.refresh();
          });
        }
      });
  }

  public getCategory(category: string): Observable<Category> {
    if (!this.categories.has(category)) {
      this.categories.set(category, new ReplaySubject<Category>(1));
      this.categoryService.getOne(category).subscribe((c) => this.categories.get(category)!.next(c));
    }
    return this.categories.get(category) as Observable<Category>;
  }
}
