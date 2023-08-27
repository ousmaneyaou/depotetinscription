import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnneeScolaire, NewAnneeScolaire } from '../annee-scolaire.model';

export type PartialUpdateAnneeScolaire = Partial<IAnneeScolaire> & Pick<IAnneeScolaire, 'id'>;

export type EntityResponseType = HttpResponse<IAnneeScolaire>;
export type EntityArrayResponseType = HttpResponse<IAnneeScolaire[]>;

@Injectable({ providedIn: 'root' })
export class AnneeScolaireService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/annee-scolaires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(anneeScolaire: NewAnneeScolaire): Observable<EntityResponseType> {
    return this.http.post<IAnneeScolaire>(this.resourceUrl, anneeScolaire, { observe: 'response' });
  }

  update(anneeScolaire: IAnneeScolaire): Observable<EntityResponseType> {
    return this.http.put<IAnneeScolaire>(`${this.resourceUrl}/${this.getAnneeScolaireIdentifier(anneeScolaire)}`, anneeScolaire, {
      observe: 'response',
    });
  }

  partialUpdate(anneeScolaire: PartialUpdateAnneeScolaire): Observable<EntityResponseType> {
    return this.http.patch<IAnneeScolaire>(`${this.resourceUrl}/${this.getAnneeScolaireIdentifier(anneeScolaire)}`, anneeScolaire, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnneeScolaire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnneeScolaire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnneeScolaireIdentifier(anneeScolaire: Pick<IAnneeScolaire, 'id'>): number {
    return anneeScolaire.id;
  }

  compareAnneeScolaire(o1: Pick<IAnneeScolaire, 'id'> | null, o2: Pick<IAnneeScolaire, 'id'> | null): boolean {
    return o1 && o2 ? this.getAnneeScolaireIdentifier(o1) === this.getAnneeScolaireIdentifier(o2) : o1 === o2;
  }

  addAnneeScolaireToCollectionIfMissing<Type extends Pick<IAnneeScolaire, 'id'>>(
    anneeScolaireCollection: Type[],
    ...anneeScolairesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const anneeScolaires: Type[] = anneeScolairesToCheck.filter(isPresent);
    if (anneeScolaires.length > 0) {
      const anneeScolaireCollectionIdentifiers = anneeScolaireCollection.map(
        anneeScolaireItem => this.getAnneeScolaireIdentifier(anneeScolaireItem)!
      );
      const anneeScolairesToAdd = anneeScolaires.filter(anneeScolaireItem => {
        const anneeScolaireIdentifier = this.getAnneeScolaireIdentifier(anneeScolaireItem);
        if (anneeScolaireCollectionIdentifiers.includes(anneeScolaireIdentifier)) {
          return false;
        }
        anneeScolaireCollectionIdentifiers.push(anneeScolaireIdentifier);
        return true;
      });
      return [...anneeScolairesToAdd, ...anneeScolaireCollection];
    }
    return anneeScolaireCollection;
  }
}
