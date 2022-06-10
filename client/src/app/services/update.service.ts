import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, map, Observable, startWith } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  public versionReady$: Observable<boolean>;

  constructor(private readonly swUpdate: SwUpdate, private readonly appRef: ApplicationRef) {
    if (environment.production && location.protocol.startsWith('https')) {
      const appIsStable$ = appRef.isStable.pipe(map((stable) => stable));
      const every30Seconds$ = interval(30 * 1000);
      const every30SecondsWhenAppIsStable$ = concat(appIsStable$, every30Seconds$);
      every30SecondsWhenAppIsStable$.subscribe(() => swUpdate.checkForUpdate());
    }

    this.versionReady$ = swUpdate.versionUpdates.pipe(map((event) => event.type === 'VERSION_READY'), startWith(false));
  }
}
