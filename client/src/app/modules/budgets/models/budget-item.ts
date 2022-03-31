import {IModel, Model} from '../../../models/model';

export interface IBudgetItem extends IModel {
  name: string;
  category?: string;
  column: string;
  amount: number;
  order: number;
}

export class BudgetItem extends Model<IBudgetItem> {
  public name!: string;
  public category?: string;
  public column?: string;
  public amount!: number;
  public order?: number;

  constructor(data: Partial<IBudgetItem>) {
    super(data);
  }

  serialise(): Partial<IBudgetItem> {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      amount: this.amount,
      order: this.order,
      category: this.category,
      column: this.column,
    };
  }

  setData(data: Partial<IBudgetItem>): void {
    this.name = data.name!;
    this.amount = data.amount || 0;
    this.order = data.order;
    this.category = data.category;
    this.column = data.column;
  }
}
