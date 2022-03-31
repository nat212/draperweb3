import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BudgetColumn } from '../../models/budget-column';
import { BudgetItemService } from '../../services/budget-item.service';
import { concat, Observable, tap, toArray } from 'rxjs';
import { BudgetItem } from '../../models/budget-item';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../../../services/alert.service';
import { ItemAddEditComponent } from '../../modals/item-add-edit/item-add-edit.component';
import { BudgetColumnService } from '../../services/budget-column.service';
import { CategoryRepo } from '../../repos/category.repo';
import { Category } from '../../models/category';

@Component({
  selector: 'app-column-detail',
  templateUrl: './column-detail.component.html',
  styleUrls: ['./column-detail.component.scss'],
})
export class ColumnDetailComponent implements OnInit {
  @Input() column!: BudgetColumn;

  public items$!: Observable<BudgetItem[]>;
  public loading = false;

  constructor(
    private readonly itemService: BudgetItemService,
    private readonly modalService: BsModalService,
    private readonly alert: AlertService,
    private readonly columnService: BudgetColumnService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly categoryRepo: CategoryRepo,
  ) {}

  ngOnInit(): void {
    this.setItems(this.column.items);
  }

  private setItems(items: string[]): void {
    this.loading = true;
    this.items$ = concat(...items.map((item) => this.itemService.getOne(item))).pipe(
      toArray(),
      tap(() => {
        this.loading = false;
        this.cdRef.detectChanges();
      }),
    );
  }

  private refresh(): void {
    this.columnService.getOne(this.column.url!).subscribe((column) => {
      this.setItems(column.items);
    });
  }

  public addItem(): void {
    this.alert.openModal(this.modalService, ItemAddEditComponent, {}, ['changed', 'model']).subscribe(({ changed, model }) => {
      if (changed && model) {
        this.loading = true;
        model.column = this.column.url;
        this.itemService.createOne(model).subscribe();
        this.refresh();
      }
    });
  }

  public editItem(item: BudgetItem): void {
    this.alert
      .openModal(this.modalService, ItemAddEditComponent, { model: item }, ['changed', 'model', 'deleted'])
      .subscribe(({ changed, model, deleted }) => {
        if (deleted) {
          this.loading = true;
          this.alert
            .confirm(this.modalService, 'Delete Item', `Are you sure you wish to delete the item ${item.name}?`)
            .subscribe((confirmed) => {
              if (confirmed) {
                this.itemService.removeOne(item).subscribe();
                this.refresh();
              }
            });
        } else if (changed && model) {
          this.loading = true;
          this.itemService.updateOne(model).subscribe();
          this.refresh();
        }
      });
  }

  public getCategory(category: string): Observable<Category> {
    return this.categoryRepo.getEntity(category);
  }
}
