import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBachelier, NewBachelier } from '../bachelier.model';

export type PartialUpdateBachelier = Partial<IBachelier> & Pick<IBachelier, 'id'>;

type RestOf<T extends IBachelier | NewBachelier> = Omit<T, 'dateNaissance'> & {
  dateNaissance?: string | null;
};

export type RestBachelier = RestOf<IBachelier>;

export type NewRestBachelier = RestOf<NewBachelier>;

export type PartialUpdateRestBachelier = RestOf<PartialUpdateBachelier>;

export type EntityResponseType = HttpResponse<IBachelier>;
export type EntityArrayResponseType = HttpResponse<IBachelier[]>;

@Injectable({ providedIn: 'root' })
export class BachelierService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bacheliers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bachelier: NewBachelier): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bachelier);
    return this.http
      .post<RestBachelier>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(bachelier: IBachelier): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bachelier);
    return this.http
      .put<RestBachelier>(`${this.resourceUrl}/${this.getBachelierIdentifier(bachelier)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(bachelier: PartialUpdateBachelier): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bachelier);
    return this.http
      .patch<RestBachelier>(`${this.resourceUrl}/${this.getBachelierIdentifier(bachelier)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBachelier>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBachelier[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBachelierIdentifier(bachelier: Pick<IBachelier, 'id'>): number {
    return bachelier.id;
  }

  compareBachelier(o1: Pick<IBachelier, 'id'> | null, o2: Pick<IBachelier, 'id'> | null): boolean {
    return o1 && o2 ? this.getBachelierIdentifier(o1) === this.getBachelierIdentifier(o2) : o1 === o2;
  }

  addBachelierToCollectionIfMissing<Type extends Pick<IBachelier, 'id'>>(
    bachelierCollection: Type[],
    ...bacheliersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bacheliers: Type[] = bacheliersToCheck.filter(isPresent);
    if (bacheliers.length > 0) {
      const bachelierCollectionIdentifiers = bachelierCollection.map(bachelierItem => this.getBachelierIdentifier(bachelierItem)!);
      const bacheliersToAdd = bacheliers.filter(bachelierItem => {
        const bachelierIdentifier = this.getBachelierIdentifier(bachelierItem);
        if (bachelierCollectionIdentifiers.includes(bachelierIdentifier)) {
          return false;
        }
        bachelierCollectionIdentifiers.push(bachelierIdentifier);
        return true;
      });
      return [...bacheliersToAdd, ...bachelierCollection];
    }
    return bachelierCollection;
  }

  protected convertDateFromClient<T extends IBachelier | NewBachelier | PartialUpdateBachelier>(bachelier: T): RestOf<T> {
    return {
      ...bachelier,
      dateNaissance: bachelier.dateNaissance?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restBachelier: RestBachelier): IBachelier {
    return {
      ...restBachelier,
      dateNaissance: restBachelier.dateNaissance ? dayjs(restBachelier.dateNaissance) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBachelier>): HttpResponse<IBachelier> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBachelier[]>): HttpResponse<IBachelier[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
