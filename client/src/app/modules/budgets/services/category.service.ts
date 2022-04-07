import { Injectable } from '@angular/core';
import { EntityService } from '../../../lib/entity-service';
import { Category, ICategory } from '../models/category';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends EntityService<ICategory, Category, {}> {
  protected url = '/api/budgets/categories/';
  protected entityClass = Category;

  constructor(http: HttpClient) {
    super(http);
  }
}
