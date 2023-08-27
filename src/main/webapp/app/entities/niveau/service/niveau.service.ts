import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INiveau, NewNiveau } from '../niveau.model';

export type PartialUpdateNiveau = Partial<INiveau> & Pick<INiveau, 'id'>;

export type EntityResponseType = HttpResponse<INiveau>;
export type EntityArrayResponseType = HttpResponse<INiveau[]>;

@Injectable({ providedIn: 'root' })
export class NiveauService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/niveaus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(niveau: NewNiveau): Observable<EntityResponseType> {
    return this.http.post<INiveau>(this.resourceUrl, niveau, { observe: 'response' });
  }

  update(niveau: INiveau): Observable<EntityResponseType> {
    return this.http.put<INiveau>(`${this.resourceUrl}/${this.getNiveauIdentifier(niveau)}`, niveau, { observe: 'response' });
  }

  partialUpdate(niveau: PartialUpdateNiveau): Observable<EntityResponseType> {
    return this.http.patch<INiveau>(`${this.resourceUrl}/${this.getNiveauIdentifier(niveau)}`, niveau, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INiveau>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INiveau[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNiveauIdentifier(niveau: Pick<INiveau, 'id'>): number {
    return niveau.id;
  }

  compareNiveau(o1: Pick<INiveau, 'id'> | null, o2: Pick<INiveau, 'id'> | null): boolean {
    return o1 && o2 ? this.getNiveauIdentifier(o1) === this.getNiveauIdentifier(o2) : o1 === o2;
  }

  addNiveauToCollectionIfMissing<Type extends Pick<INiveau, 'id'>>(
    niveauCollection: Type[],
    ...niveausToCheck: (Type | null | undefined)[]
  ): Type[] {
    const niveaus: Type[] = niveausToCheck.filter(isPresent);
    if (niveaus.length > 0) {
      const niveauCollectionIdentifiers = niveauCollection.map(niveauItem => this.getNiveauIdentifier(niveauItem)!);
      const niveausToAdd = niveaus.filter(niveauItem => {
        const niveauIdentifier = this.getNiveauIdentifier(niveauItem);
        if (niveauCollectionIdentifiers.includes(niveauIdentifier)) {
          return false;
        }
        niveauCollectionIdentifiers.push(niveauIdentifier);
        return true;
      });
      return [...niveausToAdd, ...niveauCollection];
    }
    return niveauCollection;
  }
}
