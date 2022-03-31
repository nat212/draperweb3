import { IModel, Model } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { createState, select, Store } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  selectEntity,
  setEntities,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { EntityService, IFilter } from './entity-service';
import { Observable, tap } from 'rxjs';

export abstract class EntityRepo<T extends Model<O>, O extends IModel = IModel, F extends IFilter = {}> extends EntityService<O, T, F> {
  protected readonly store: Store;

  public models$: Observable<T[]>;

  protected constructor(http: HttpClient, name: string) {
    super(http);
    const { state, config } = createState(withEntities<T, 'url'>({ idKey: 'url' }));
    this.store = new Store({ name: name, config, state });
    this.models$ = this.store.pipe(selectAllEntities());
  }

  public override getMany(filters?: F, search?: string) {
    return super.getMany(filters, search).pipe(tap((entities) => this.store.update(setEntities(entities))));
  }

  public override getOne(idOrUrl: string) {
    return super.getOne(idOrUrl).pipe(tap((entity) => this.store.update(updateEntities(entity.url, () => entity))));
  }

  public override createOne(model: T): Observable<T> {
    return super.createOne(model).pipe(tap((entities) => this.store.update(addEntities(entities))));
  }

  public override updateOne(model: T): Observable<T> {
    return super.updateOne(model).pipe(tap((entity) => this.store.update(updateEntities(entity.url, () => entity))));
  }

  public override removeOne(model: T): Observable<null> {
    return super.removeOne(model).pipe(tap(() => this.store.update(deleteEntities(model.url))));
  }

  public getEntity(idOrUrl: string | number): Observable<T> {
    if (typeof idOrUrl === 'string') {
      return this.store.pipe(selectEntity(idOrUrl));
    } else {
      const url = this.getModelUrl(idOrUrl);
      return this.store.pipe(selectEntity(url));
    }
  }
}
