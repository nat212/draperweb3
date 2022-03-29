import {Model} from '../../../models/model';

export interface IBudgetColumn {
  url?: string;
  id?: number;
  name: string;
  budget?: string;
  items?: string[];
  summary?: string;
  breakdown?: string;
}

export class BudgetColumn extends Model<IBudgetColumn> {
  readonly id?: number;
  readonly url?: string;
  public name!: string;
  public budget?: string;
  public budgetId?: number;
  public items!: string[];
  public summary?: string;
  public breakdown?: string;

  constructor(data: IBudgetColumn) {
    super(data);
    this.id = data.id;
    this.url = data.url;
  }

  serialise(): Partial<IBudgetColumn> {
    return {
      name: this.name,
      budget: this.budget,
    };
  }

  setData(data: IBudgetColumn): void {
    this.name = data.name;
    this.budget = data.budget;
    this.items = data.items || [];
    this.breakdown = data.breakdown;
    this.summary = data.summary;
  }
}
