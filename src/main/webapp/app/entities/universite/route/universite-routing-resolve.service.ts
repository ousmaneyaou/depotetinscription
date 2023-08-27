import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUniversite } from '../universite.model';
import { UniversiteService } from '../service/universite.service';

@Injectable({ providedIn: 'root' })
export class UniversiteRoutingResolveService implements Resolve<IUniversite | null> {
  constructor(protected service: UniversiteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUniversite | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((universite: HttpResponse<IUniversite>) => {
          if (universite.body) {
            return of(universite.body);
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
