import {IModel, Model} from '../../../models/model';

export interface IBudgetColumn extends IModel {
  name: string;
  budget?: string;
  items?: string[];
  summary?: string;
  breakdown?: string;
}

export class BudgetColumn extends Model<IBudgetColumn> {
  public name!: string;
  public budget?: string;
  public budgetId?: number;
  public items!: string[];
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
    this.items = data.items || [];
    this.breakdown = data.breakdown;
    this.summary = data.summary;
  }
}
