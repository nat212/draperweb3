import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { filter, map, Observable, pluck, switchMap, tap } from 'rxjs';
import { Budget } from '../../models/budget';
import { BudgetItem } from '../../models/budget-item';
import { BudgetColumn } from '../../models/budget-column';

@Component({
  selector: 'app-budget-import',
  templateUrl: './budget-import.component.html',
  styleUrls: ['./budget-import.component.scss'],
})
export class BudgetImportComponent implements OnInit {
  budget!: Budget;
  budget$!: Observable<Budget>;
  from!: Budget;
  from$!: Observable<Budget>;
  itemsSelected: { [key: number]: number[] } = {};

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly service: BudgetService) {}

  ngOnInit() {
    this.budget$ = this.route.data.pipe(pluck('budget'), tap((budget) => this.budget = budget));
    this.from$ = this.route.queryParams.pipe(
      pluck('from'),
      filter((from) => !!from),
      map((from) => parseInt(from, 10)),
      switchMap((from) => this.service.getOne(from)),
      tap((budget) => {
        budget.columns?.forEach((column) => {
          this.itemsSelected[column.id] = column.items.map((item) => item.id);
        });
        this.from = budget;
      }),
    );
  }

  isItemSelected(column: BudgetColumn, item: BudgetItem): boolean {
    return this.itemsSelected[column.id].includes(item.id);
  }

  selectItem(column: BudgetColumn, item: BudgetItem): void {
    if (!this.isItemSelected(column, item)) {
      this.itemsSelected[column.id] = [...this.itemsSelected[column.id], item.id];
    }
  }

  deselectItem(column: BudgetColumn, item: BudgetItem): void {
    if (this.isItemSelected(column, item)) {
      this.itemsSelected[column.id] = this.itemsSelected[column.id].filter((i) => i !== item.id);
    }
  }

  onCheckboxChange(column: BudgetColumn, item: BudgetItem, $event: Event) {
    $event.cancelBubble = true;
    const el: HTMLInputElement = $event.target as HTMLInputElement;
    if (el.checked) {
      this.selectItem(column, item);
    } else {
      this.deselectItem(column, item);
    }
  }

  submit() {
    const data = {
      budget: this.from.url,
      columns: Object.keys(this.itemsSelected).map((key) => parseInt(key, 10)),
      items: this.itemsSelected,
    };
    this.service.performAction('POST', this.budget, 'importColumnsUrl', data).subscribe(() => {
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }
}
