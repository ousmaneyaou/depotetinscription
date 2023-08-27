import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICampagne } from '../campagne.model';
import { CampagneService } from '../service/campagne.service';

@Injectable({ providedIn: 'root' })
export class CampagneRoutingResolveService implements Resolve<ICampagne | null> {
  constructor(protected service: CampagneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICampagne | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((campagne: HttpResponse<ICampagne>) => {
          if (campagne.body) {
            return of(campagne.body);
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
