import { IModel, Model } from '../../../models/model';

export interface ICategory extends IModel {
  name: string;
  description?: string;
  icon: string;
}

export class Category extends Model<ICategory> {
  public name!: string;
  public description?: string;
  public icon!: string;

  constructor(data: Partial<ICategory>) {
    super(data);
  }

  serialise(): Partial<ICategory> {
    return {
      name: this.name,
      description: this.description,
      icon: this.icon,
    };
  }

  setData(data: ICategory): void {
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon;
  }
}
