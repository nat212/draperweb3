import {IModel, Model} from '../../../models/model';
import { BudgetColumn, IBudgetColumn } from "./budget-column";

export interface IBudget extends IModel {
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  columns?: IBudgetColumn[];
  import_columns?: string;
}

export class Budget extends Model<IBudget> {
  public name!: string;
  public startDate?: Date;
  public endDate?: Date;
  public columns?: BudgetColumn[];
  public importColumnsUrl?: string;

  constructor(data: Partial<IBudget>) {
    super(data);
  }

  setData(data: IBudget): void {
    this.name = data.name;
    this.startDate = data.start_date ? new Date(data.start_date) : undefined;
    this.endDate = data.end_date ? new Date(data.end_date) : undefined;
    this.columns = data.columns?.map(column => new BudgetColumn(column)) || [];
    this.importColumnsUrl = data.import_columns;
  }

  override serialise(): Partial<IBudget> {
    return {
      start_date: this.startDate?.toISOString().split('T')[0] ?? null,
      end_date: this.endDate?.toISOString().split('T')[0] ?? null,
      name: this.name,
    };
  }
}
