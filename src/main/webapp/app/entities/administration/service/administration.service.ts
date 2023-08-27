import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdministration, NewAdministration } from '../administration.model';

export type PartialUpdateAdministration = Partial<IAdministration> & Pick<IAdministration, 'id'>;

export type EntityResponseType = HttpResponse<IAdministration>;
export type EntityArrayResponseType = HttpResponse<IAdministration[]>;

@Injectable({ providedIn: 'root' })
export class AdministrationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/administrations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(administration: NewAdministration): Observable<EntityResponseType> {
    return this.http.post<IAdministration>(this.resourceUrl, administration, { observe: 'response' });
  }

  update(administration: IAdministration): Observable<EntityResponseType> {
    return this.http.put<IAdministration>(`${this.resourceUrl}/${this.getAdministrationIdentifier(administration)}`, administration, {
      observe: 'response',
    });
  }

  partialUpdate(administration: PartialUpdateAdministration): Observable<EntityResponseType> {
    return this.http.patch<IAdministration>(`${this.resourceUrl}/${this.getAdministrationIdentifier(administration)}`, administration, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdministration>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdministration[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAdministrationIdentifier(administration: Pick<IAdministration, 'id'>): number {
    return administration.id;
  }

  compareAdministration(o1: Pick<IAdministration, 'id'> | null, o2: Pick<IAdministration, 'id'> | null): boolean {
    return o1 && o2 ? this.getAdministrationIdentifier(o1) === this.getAdministrationIdentifier(o2) : o1 === o2;
  }

  addAdministrationToCollectionIfMissing<Type extends Pick<IAdministration, 'id'>>(
    administrationCollection: Type[],
    ...administrationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const administrations: Type[] = administrationsToCheck.filter(isPresent);
    if (administrations.length > 0) {
      const administrationCollectionIdentifiers = administrationCollection.map(
        administrationItem => this.getAdministrationIdentifier(administrationItem)!
      );
      const administrationsToAdd = administrations.filter(administrationItem => {
        const administrationIdentifier = this.getAdministrationIdentifier(administrationItem);
        if (administrationCollectionIdentifiers.includes(administrationIdentifier)) {
          return false;
        }
        administrationCollectionIdentifiers.push(administrationIdentifier);
        return true;
      });
      return [...administrationsToAdd, ...administrationCollection];
    }
    return administrationCollection;
  }
}
