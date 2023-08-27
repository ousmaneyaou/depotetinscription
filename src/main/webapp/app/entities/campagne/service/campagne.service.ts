import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICampagne, NewCampagne } from '../campagne.model';

export type PartialUpdateCampagne = Partial<ICampagne> & Pick<ICampagne, 'id'>;

type RestOf<T extends ICampagne | NewCampagne> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestCampagne = RestOf<ICampagne>;

export type NewRestCampagne = RestOf<NewCampagne>;

export type PartialUpdateRestCampagne = RestOf<PartialUpdateCampagne>;

export type EntityResponseType = HttpResponse<ICampagne>;
export type EntityArrayResponseType = HttpResponse<ICampagne[]>;

@Injectable({ providedIn: 'root' })
export class CampagneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/campagnes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(campagne: NewCampagne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campagne);
    return this.http
      .post<RestCampagne>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(campagne: ICampagne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campagne);
    return this.http
      .put<RestCampagne>(`${this.resourceUrl}/${this.getCampagneIdentifier(campagne)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(campagne: PartialUpdateCampagne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campagne);
    return this.http
      .patch<RestCampagne>(`${this.resourceUrl}/${this.getCampagneIdentifier(campagne)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCampagne>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCampagne[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCampagneIdentifier(campagne: Pick<ICampagne, 'id'>): number {
    return campagne.id;
  }

  compareCampagne(o1: Pick<ICampagne, 'id'> | null, o2: Pick<ICampagne, 'id'> | null): boolean {
    return o1 && o2 ? this.getCampagneIdentifier(o1) === this.getCampagneIdentifier(o2) : o1 === o2;
  }

  addCampagneToCollectionIfMissing<Type extends Pick<ICampagne, 'id'>>(
    campagneCollection: Type[],
    ...campagnesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const campagnes: Type[] = campagnesToCheck.filter(isPresent);
    if (campagnes.length > 0) {
      const campagneCollectionIdentifiers = campagneCollection.map(campagneItem => this.getCampagneIdentifier(campagneItem)!);
      const campagnesToAdd = campagnes.filter(campagneItem => {
        const campagneIdentifier = this.getCampagneIdentifier(campagneItem);
        if (campagneCollectionIdentifiers.includes(campagneIdentifier)) {
          return false;
        }
        campagneCollectionIdentifiers.push(campagneIdentifier);
        return true;
      });
      return [...campagnesToAdd, ...campagneCollection];
    }
    return campagneCollection;
  }

  protected convertDateFromClient<T extends ICampagne | NewCampagne | PartialUpdateCampagne>(campagne: T): RestOf<T> {
    return {
      ...campagne,
      dateDebut: campagne.dateDebut?.format(DATE_FORMAT) ?? null,
      dateFin: campagne.dateFin?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCampagne: RestCampagne): ICampagne {
    return {
      ...restCampagne,
      dateDebut: restCampagne.dateDebut ? dayjs(restCampagne.dateDebut) : undefined,
      dateFin: restCampagne.dateFin ? dayjs(restCampagne.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCampagne>): HttpResponse<ICampagne> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCampagne[]>): HttpResponse<ICampagne[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
