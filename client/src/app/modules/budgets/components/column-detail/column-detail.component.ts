import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BudgetColumn, IColumnSummary } from '../../models/budget-column';
import { BudgetItemService } from '../../services/budget-item.service';
import { BehaviorSubject, first, ReplaySubject, Subject } from 'rxjs';
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

  private setItems(items: BudgetItem[]): void {
    this.items$.next(items);
  }

  private addItem(item: BudgetItem): void {
    this.items$.pipe(first()).subscribe((items) => {
      this.items$.next([...items, item]);
      this.loading = false;
    });
  }

  private removeItem(item: BudgetItem): void {
    this.items$.pipe(first()).subscribe((items) => {
      this.items$.next(items.filter((i) => i.url !== item.url));
      this.loading = false;
    });
  }

  private updateItem(item: BudgetItem): void {
    this.items$.pipe(first()).subscribe((items) => {
      const index = items.findIndex((i) => i.url === item.url);
      const itemsCopy = [...items];
      itemsCopy[index] = item;
      this.items$.next(itemsCopy);
      this.loading = false;
    });
  }

  public createItem(): void {
    this.alert.openModal(this.modalService, ItemAddEditComponent, {}, ['changed', 'model']).subscribe(({ changed, model }) => {
      if (changed && model) {
        model.column = this.column.url;
        this.itemService.createOne(model).subscribe((item) => {
          this.addItem(item);
          this.setSummary();
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
                this.itemService.removeOne(item).subscribe(() => {
                  this.removeItem(item);
                  this.setSummary();
                });
              }
            });
        } else if (changed && model) {
          this.itemService.updateOne(model).subscribe((result) => {
            this.updateItem(result);
            this.setSummary();
          });
        }
      });
  }
}
