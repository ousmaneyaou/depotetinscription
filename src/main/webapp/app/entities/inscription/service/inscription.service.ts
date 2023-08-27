import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInscription, NewInscription } from '../inscription.model';

export type PartialUpdateInscription = Partial<IInscription> & Pick<IInscription, 'id'>;

type RestOf<T extends IInscription | NewInscription> = Omit<T, 'dateInscription'> & {
  dateInscription?: string | null;
};

export type RestInscription = RestOf<IInscription>;

export type NewRestInscription = RestOf<NewInscription>;

export type PartialUpdateRestInscription = RestOf<PartialUpdateInscription>;

export type EntityResponseType = HttpResponse<IInscription>;
export type EntityArrayResponseType = HttpResponse<IInscription[]>;

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/inscriptions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(inscription: NewInscription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inscription);
    return this.http
      .post<RestInscription>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(inscription: IInscription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inscription);
    return this.http
      .put<RestInscription>(`${this.resourceUrl}/${this.getInscriptionIdentifier(inscription)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(inscription: PartialUpdateInscription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inscription);
    return this.http
      .patch<RestInscription>(`${this.resourceUrl}/${this.getInscriptionIdentifier(inscription)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInscription>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInscription[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInscriptionIdentifier(inscription: Pick<IInscription, 'id'>): number {
    return inscription.id;
  }

  compareInscription(o1: Pick<IInscription, 'id'> | null, o2: Pick<IInscription, 'id'> | null): boolean {
    return o1 && o2 ? this.getInscriptionIdentifier(o1) === this.getInscriptionIdentifier(o2) : o1 === o2;
  }

  addInscriptionToCollectionIfMissing<Type extends Pick<IInscription, 'id'>>(
    inscriptionCollection: Type[],
    ...inscriptionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const inscriptions: Type[] = inscriptionsToCheck.filter(isPresent);
    if (inscriptions.length > 0) {
      const inscriptionCollectionIdentifiers = inscriptionCollection.map(
        inscriptionItem => this.getInscriptionIdentifier(inscriptionItem)!
      );
      const inscriptionsToAdd = inscriptions.filter(inscriptionItem => {
        const inscriptionIdentifier = this.getInscriptionIdentifier(inscriptionItem);
        if (inscriptionCollectionIdentifiers.includes(inscriptionIdentifier)) {
          return false;
        }
        inscriptionCollectionIdentifiers.push(inscriptionIdentifier);
        return true;
      });
      return [...inscriptionsToAdd, ...inscriptionCollection];
    }
    return inscriptionCollection;
  }

  protected convertDateFromClient<T extends IInscription | NewInscription | PartialUpdateInscription>(inscription: T): RestOf<T> {
    return {
      ...inscription,
      dateInscription: inscription.dateInscription?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restInscription: RestInscription): IInscription {
    return {
      ...restInscription,
      dateInscription: restInscription.dateInscription ? dayjs(restInscription.dateInscription) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInscription>): HttpResponse<IInscription> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInscription[]>): HttpResponse<IInscription[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
