import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInscription } from '../inscription.model';
import { InscriptionService } from '../service/inscription.service';

@Injectable({ providedIn: 'root' })
export class InscriptionRoutingResolveService implements Resolve<IInscription | null> {
  constructor(protected service: InscriptionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInscription | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((inscription: HttpResponse<IInscription>) => {
          if (inscription.body) {
            return of(inscription.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
