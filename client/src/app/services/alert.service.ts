import { Injectable, Type } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map, take } from 'rxjs/operators';
import { ConfirmComponent } from '../modals/confirm/confirm.component';
import { combineLatest, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  public confirm(
    modal: BsModalService,
    title: string,
    message: string
  ): Observable<boolean> {
    const modalRef = modal.show(ConfirmComponent, {
      initialState: { title, message },
    });
    return combineLatest([modalRef.onHidden, modalRef.onHide]).pipe(
      take(1),
      map(() => modalRef.content!.result)
    );
  }

  public openModal<T, K extends (keyof T)[]>(
    modal: BsModalService,
    component: Type<T>,
    initialState?: Partial<T>,
    pluck?: K,
  ): Observable<{ [k in K[number]]: T[k] }> {
    const modalRef = modal.show(component, { initialState });
    return combineLatest([modalRef.onHidden, modalRef.onHide]).pipe(
      take(1),
      map(() => modalRef.content!),
      map((content) =>
        Object.assign({}, ...(pluck || []).map((k) => ({ [k]: content[k] })))
      )
    );
  }
}
