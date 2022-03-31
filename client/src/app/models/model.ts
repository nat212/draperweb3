export interface IModel {
  id?: number;
  url?: string;
}

export abstract class Model<T extends IModel> {
  public readonly id: number;
  public readonly url: string;

  protected constructor(data: Partial<T>) {
    this.id = data.id ?? -1;
    this.url = data.url ?? '';
    this.setData(data);
  }

  public abstract setData(data: Partial<T>): void;

  public abstract serialise(): Partial<T>;
}
