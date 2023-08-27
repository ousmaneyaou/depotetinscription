import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBachelier } from '../bachelier.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../bachelier.test-samples';

import { BachelierService, RestBachelier } from './bachelier.service';

const requireRestSample: RestBachelier = {
  ...sampleWithRequiredData,
  dateNaissance: sampleWithRequiredData.dateNaissance?.format(DATE_FORMAT),
};

describe('Bachelier Service', () => {
  let service: BachelierService;
  let httpMock: HttpTestingController;
  let expectedResult: IBachelier | IBachelier[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BachelierService);
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

    it('should create a Bachelier', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bachelier = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bachelier).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bachelier', () => {
      const bachelier = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bachelier).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bachelier', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bachelier', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Bachelier', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBachelierToCollectionIfMissing', () => {
      it('should add a Bachelier to an empty array', () => {
        const bachelier: IBachelier = sampleWithRequiredData;
        expectedResult = service.addBachelierToCollectionIfMissing([], bachelier);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bachelier);
      });

      it('should not add a Bachelier to an array that contains it', () => {
        const bachelier: IBachelier = sampleWithRequiredData;
        const bachelierCollection: IBachelier[] = [
          {
            ...bachelier,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBachelierToCollectionIfMissing(bachelierCollection, bachelier);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bachelier to an array that doesn't contain it", () => {
        const bachelier: IBachelier = sampleWithRequiredData;
        const bachelierCollection: IBachelier[] = [sampleWithPartialData];
        expectedResult = service.addBachelierToCollectionIfMissing(bachelierCollection, bachelier);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bachelier);
      });

      it('should add only unique Bachelier to an array', () => {
        const bachelierArray: IBachelier[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bachelierCollection: IBachelier[] = [sampleWithRequiredData];
        expectedResult = service.addBachelierToCollectionIfMissing(bachelierCollection, ...bachelierArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bachelier: IBachelier = sampleWithRequiredData;
        const bachelier2: IBachelier = sampleWithPartialData;
        expectedResult = service.addBachelierToCollectionIfMissing([], bachelier, bachelier2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bachelier);
        expect(expectedResult).toContain(bachelier2);
      });

      it('should accept null and undefined values', () => {
        const bachelier: IBachelier = sampleWithRequiredData;
        expectedResult = service.addBachelierToCollectionIfMissing([], null, bachelier, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bachelier);
      });

      it('should return initial array if no Bachelier is added', () => {
        const bachelierCollection: IBachelier[] = [sampleWithRequiredData];
        expectedResult = service.addBachelierToCollectionIfMissing(bachelierCollection, undefined, null);
        expect(expectedResult).toEqual(bachelierCollection);
      });
    });

    describe('compareBachelier', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBachelier(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBachelier(entity1, entity2);
        const compareResult2 = service.compareBachelier(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBachelier(entity1, entity2);
        const compareResult2 = service.compareBachelier(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBachelier(entity1, entity2);
        const compareResult2 = service.compareBachelier(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
