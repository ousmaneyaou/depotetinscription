import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdministration } from '../administration.model';
import { AdministrationService } from '../service/administration.service';

@Injectable({ providedIn: 'root' })
export class AdministrationRoutingResolveService implements Resolve<IAdministration | null> {
  constructor(protected service: AdministrationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdministration | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((administration: HttpResponse<IAdministration>) => {
          if (administration.body) {
            return of(administration.body);
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
