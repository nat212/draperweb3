export abstract class Model<T> {
  public readonly abstract id?: number;
  public readonly abstract url?: string;

  protected constructor(data: T) {
    this.setData(data);
  }

  public abstract setData(data: T): void;
  public abstract serialise(): Partial<T>;
}
