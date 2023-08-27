import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDepot, NewDepot } from '../depot.model';

export type PartialUpdateDepot = Partial<IDepot> & Pick<IDepot, 'id'>;

export type EntityResponseType = HttpResponse<IDepot>;
export type EntityArrayResponseType = HttpResponse<IDepot[]>;

@Injectable({ providedIn: 'root' })
export class DepotService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/depots');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(depot: NewDepot): Observable<EntityResponseType> {
    return this.http.post<IDepot>(this.resourceUrl, depot, { observe: 'response' });
  }

  update(depot: IDepot): Observable<EntityResponseType> {
    return this.http.put<IDepot>(`${this.resourceUrl}/${this.getDepotIdentifier(depot)}`, depot, { observe: 'response' });
  }

  partialUpdate(depot: PartialUpdateDepot): Observable<EntityResponseType> {
    return this.http.patch<IDepot>(`${this.resourceUrl}/${this.getDepotIdentifier(depot)}`, depot, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDepot>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDepot[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDepotIdentifier(depot: Pick<IDepot, 'id'>): number {
    return depot.id;
  }

  compareDepot(o1: Pick<IDepot, 'id'> | null, o2: Pick<IDepot, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepotIdentifier(o1) === this.getDepotIdentifier(o2) : o1 === o2;
  }

  addDepotToCollectionIfMissing<Type extends Pick<IDepot, 'id'>>(
    depotCollection: Type[],
    ...depotsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const depots: Type[] = depotsToCheck.filter(isPresent);
    if (depots.length > 0) {
      const depotCollectionIdentifiers = depotCollection.map(depotItem => this.getDepotIdentifier(depotItem)!);
      const depotsToAdd = depots.filter(depotItem => {
        const depotIdentifier = this.getDepotIdentifier(depotItem);
        if (depotCollectionIdentifiers.includes(depotIdentifier)) {
          return false;
        }
        depotCollectionIdentifiers.push(depotIdentifier);
        return true;
      });
      return [...depotsToAdd, ...depotCollection];
    }
    return depotCollection;
  }
}
