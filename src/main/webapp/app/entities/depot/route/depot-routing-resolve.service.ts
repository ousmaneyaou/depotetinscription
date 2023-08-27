import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDepot } from '../depot.model';
import { DepotService } from '../service/depot.service';

@Injectable({ providedIn: 'root' })
export class DepotRoutingResolveService implements Resolve<IDepot | null> {
  constructor(protected service: DepotService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDepot | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((depot: HttpResponse<IDepot>) => {
          if (depot.body) {
            return of(depot.body);
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
