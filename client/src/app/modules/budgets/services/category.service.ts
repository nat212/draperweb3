import { Injectable } from '@angular/core';
import { EntityService } from '../../../lib/entity-service';
import { Category, ICategory } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends EntityService<ICategory, Category, {}> {
  protected url = '/api/budgets/categories/';
  protected entityClass = Category;

  private categories: Map<string, Category>;

  constructor(http: HttpClient) {
    super(http);
    this.categories = new Map<string, Category>();
  }

  protected override fetch(filters?: {}, search?: string): Observable<Category[]> {
    return super.fetch(filters, search).pipe(
      tap((categories) => {
        categories.forEach((category) => this.categories.set(category.url, category));
      }),
    );
  }

  protected override fetchOne(idOrUrl: number | string): Observable<Category> {
    const url = typeof idOrUrl === 'number' ? this.getModelUrl(idOrUrl) : idOrUrl;
    if (this.categories.has(url)) {
      return of(this.categories.get(url)!);
    }
    return super.fetchOne(idOrUrl);
  }

  public override createOne(entity: Category): Observable<Category> {
    return super.createOne(entity).pipe(tap((category) => this.categories.set(category.url, category)));
  }

  public override updateOne(model: Category): Observable<Category> {
    return super.updateOne(model).pipe(tap((category) => this.categories.set(category.url, category)));
  }

  public override removeOne(model: Category): Observable<null> {
    return super.removeOne(model).pipe(tap(() => this.categories.delete(model.url)));
  }
}
