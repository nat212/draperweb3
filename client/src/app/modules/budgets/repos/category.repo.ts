import { Injectable } from '@angular/core';
import { EntityRepo } from '../../../lib/entity-repo';
import { Category } from '../models/category';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryRepo extends EntityRepo<Category> {
  protected readonly entityClass = Category;
  protected readonly url = '/api/budgets/categories/';

  constructor(http: HttpClient) {
    super(http, 'categories');
  }
}

@Injectable({ providedIn: 'root' })
export class CategoryGuard implements CanActivate {
  constructor(private readonly repo: CategoryRepo) {}

  canActivate(): Observable<boolean> {
    return this.repo.getMany().pipe(map(() => true));
  }
}
