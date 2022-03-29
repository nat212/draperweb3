import {Model} from '../models/model';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Type} from '@angular/core';

interface IBackendResponse<O> {
  count: number;
  next: any;
  previous: any;
  results: O[];
}

type FilterType = Date | Date[] | number | string;

export interface IFilter {
  [key: string]: FilterType | undefined;
}

export abstract class EntityService<O, T extends Model<O>, F extends IFilter> {
  protected abstract readonly url: string;
  protected abstract readonly entityClass: Type<T>;

  protected constructor(protected readonly http: HttpClient) {}

  protected encodeFilters(filters: F): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    Object.keys(filters).forEach((key) => {
      const f = filters[key];
      if (!f) {
        return;
      }
      if (f instanceof Date) {
        result[key] = f.toISOString();
      } else if (Array.isArray(f) && f[0] instanceof Date) {
        result[`${key}_after`] = f[0].toISOString().split('T')[0];
        result[`${key}_before`] = f[1].toISOString().split('T')[0];
      } else {
        result[key] = f.toString();
      }
    });
    return result;
  }

  protected fetch(filters?: F, search?: string): Observable<T[]> {
    const params = {
      ...(filters ? this.encodeFilters(filters) : {}),
      ...(search ? { search } : {}),
    };
    return this.http
      .get<IBackendResponse<O>>(this.url, { params })
      .pipe(
        map((response) =>
          response.results.map((item) => new this.entityClass(item))
        )
      );
  }

  protected getModelUrl(id: number): string {
    return `${this.url}${id}/`;
  }

  protected fetchOne(idOrUrl: number | string): Observable<T> {
    const url =
      typeof idOrUrl === 'string' ? idOrUrl : this.getModelUrl(idOrUrl);
    return this.http
      .get<O>(url)
      .pipe(map((item) => new this.entityClass(item)));
  }

  public getMany(filters?: F, search?: string): Observable<T[]> {
    return this.fetch(filters, search);
  }

  public getOne(idOrUrl: number | string): Observable<T> {
    return this.fetchOne(idOrUrl);
  }

  public createOne(model: T): Observable<T> {
    return this.http
      .post<O>(this.url, model.serialise())
      .pipe(map((item) => new this.entityClass(item)));
  }

  public updateOne(model: T): Observable<T> {
    if (!model.id && !model.url) {
      throw new Error('Cannot update model without id or url.');
    }
    const url = model.url || this.getModelUrl(model.id!);
    return this.http
      .patch<O>(url, model.serialise())
      .pipe(map((item) => new this.entityClass(item)));
  }

  public removeOne(model: T): Observable<null> {
    if (!model.id && !model.url) {
      throw new Error('Cannot remove model without id or url.');
    }
    const url = model.url || this.getModelUrl(model.id!);
    return this.http.delete<null>(url);
  }
}
