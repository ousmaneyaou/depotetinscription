import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INiveau } from '../niveau.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../niveau.test-samples';

import { NiveauService } from './niveau.service';

const requireRestSample: INiveau = {
  ...sampleWithRequiredData,
};

describe('Niveau Service', () => {
  let service: NiveauService;
  let httpMock: HttpTestingController;
  let expectedResult: INiveau | INiveau[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NiveauService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Niveau', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const niveau = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(niveau).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Niveau', () => {
      const niveau = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(niveau).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Niveau', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Niveau', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Niveau', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNiveauToCollectionIfMissing', () => {
      it('should add a Niveau to an empty array', () => {
        const niveau: INiveau = sampleWithRequiredData;
        expectedResult = service.addNiveauToCollectionIfMissing([], niveau);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(niveau);
      });

      it('should not add a Niveau to an array that contains it', () => {
        const niveau: INiveau = sampleWithRequiredData;
        const niveauCollection: INiveau[] = [
          {
            ...niveau,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNiveauToCollectionIfMissing(niveauCollection, niveau);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Niveau to an array that doesn't contain it", () => {
        const niveau: INiveau = sampleWithRequiredData;
        const niveauCollection: INiveau[] = [sampleWithPartialData];
        expectedResult = service.addNiveauToCollectionIfMissing(niveauCollection, niveau);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(niveau);
      });

      it('should add only unique Niveau to an array', () => {
        const niveauArray: INiveau[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const niveauCollection: INiveau[] = [sampleWithRequiredData];
        expectedResult = service.addNiveauToCollectionIfMissing(niveauCollection, ...niveauArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const niveau: INiveau = sampleWithRequiredData;
        const niveau2: INiveau = sampleWithPartialData;
        expectedResult = service.addNiveauToCollectionIfMissing([], niveau, niveau2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(niveau);
        expect(expectedResult).toContain(niveau2);
      });

      it('should accept null and undefined values', () => {
        const niveau: INiveau = sampleWithRequiredData;
        expectedResult = service.addNiveauToCollectionIfMissing([], null, niveau, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(niveau);
      });

      it('should return initial array if no Niveau is added', () => {
        const niveauCollection: INiveau[] = [sampleWithRequiredData];
        expectedResult = service.addNiveauToCollectionIfMissing(niveauCollection, undefined, null);
        expect(expectedResult).toEqual(niveauCollection);
      });
    });

    describe('compareNiveau', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNiveau(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNiveau(entity1, entity2);
        const compareResult2 = service.compareNiveau(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNiveau(entity1, entity2);
        const compareResult2 = service.compareNiveau(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNiveau(entity1, entity2);
        const compareResult2 = service.compareNiveau(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
