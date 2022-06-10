import {IModel, Model} from '../../../models/model';
import { BudgetItem, IBudgetItem } from "./budget-item";

export interface IBudgetColumn extends IModel {
  name: string;
  budget?: string;
  items?: IBudgetItem[];
  summary?: string;
  breakdown?: string;
}

export interface IColumnSummary {
  expenses: number;
  income: number;
  remaining: number;
}

export class BudgetColumn extends Model<IBudgetColumn> {
  public name!: string;
  public budget?: string;
  public budgetId?: number;
  public items!: BudgetItem[];
  public summary?: string;
  public breakdown?: string;

  constructor(data: Partial<IBudgetColumn>) {
    super(data);
  }

  serialise(): Partial<IBudgetColumn> {
    return {
      name: this.name,
      budget: this.budget,
    };
  }

  setData(data: Partial<IBudgetColumn>): void {
    this.name = data.name!;
    this.budget = data.budget;
    this.items = data.items?.map(item => new BudgetItem(item)) ?? [];
    this.breakdown = data.breakdown;
    this.summary = data.summary;
  }
}
