import {Model} from '../../../models/model';

export interface IBudget {
  url?: string;
  id?: number;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  columns?: string[];
  import_columns?: string;
}

export class Budget extends Model<IBudget> {
  readonly id?: number;
  readonly url?: string;

  public name!: string;
  public startDate?: Date;
  public endDate?: Date;
  public columns?: string[];
  public importColumnsUrl?: string;

  constructor(data: IBudget) {
    super(data);
    this.id = data.id;
    this.url = data.url;
  }

  setData(data: IBudget): void {
    this.name = data.name;
    this.startDate = data.start_date ? new Date(data.start_date) : undefined;
    this.endDate = data.end_date ? new Date(data.end_date) : undefined;
    this.columns = [...data.columns || []];
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
