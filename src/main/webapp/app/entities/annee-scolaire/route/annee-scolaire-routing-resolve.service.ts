import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnneeScolaire } from '../annee-scolaire.model';
import { AnneeScolaireService } from '../service/annee-scolaire.service';

@Injectable({ providedIn: 'root' })
export class AnneeScolaireRoutingResolveService implements Resolve<IAnneeScolaire | null> {
  constructor(protected service: AnneeScolaireService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnneeScolaire | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((anneeScolaire: HttpResponse<IAnneeScolaire>) => {
          if (anneeScolaire.body) {
            return of(anneeScolaire.body);
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
