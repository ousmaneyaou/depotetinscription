import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUniversite } from '../universite.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../universite.test-samples';

import { UniversiteService } from './universite.service';

const requireRestSample: IUniversite = {
  ...sampleWithRequiredData,
};

describe('Universite Service', () => {
  let service: UniversiteService;
  let httpMock: HttpTestingController;
  let expectedResult: IUniversite | IUniversite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UniversiteService);
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

    it('should create a Universite', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const universite = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(universite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Universite', () => {
      const universite = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(universite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Universite', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Universite', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Universite', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUniversiteToCollectionIfMissing', () => {
      it('should add a Universite to an empty array', () => {
        const universite: IUniversite = sampleWithRequiredData;
        expectedResult = service.addUniversiteToCollectionIfMissing([], universite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(universite);
      });

      it('should not add a Universite to an array that contains it', () => {
        const universite: IUniversite = sampleWithRequiredData;
        const universiteCollection: IUniversite[] = [
          {
            ...universite,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUniversiteToCollectionIfMissing(universiteCollection, universite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Universite to an array that doesn't contain it", () => {
        const universite: IUniversite = sampleWithRequiredData;
        const universiteCollection: IUniversite[] = [sampleWithPartialData];
        expectedResult = service.addUniversiteToCollectionIfMissing(universiteCollection, universite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(universite);
      });

      it('should add only unique Universite to an array', () => {
        const universiteArray: IUniversite[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const universiteCollection: IUniversite[] = [sampleWithRequiredData];
        expectedResult = service.addUniversiteToCollectionIfMissing(universiteCollection, ...universiteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const universite: IUniversite = sampleWithRequiredData;
        const universite2: IUniversite = sampleWithPartialData;
        expectedResult = service.addUniversiteToCollectionIfMissing([], universite, universite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(universite);
        expect(expectedResult).toContain(universite2);
      });

      it('should accept null and undefined values', () => {
        const universite: IUniversite = sampleWithRequiredData;
        expectedResult = service.addUniversiteToCollectionIfMissing([], null, universite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(universite);
      });

      it('should return initial array if no Universite is added', () => {
        const universiteCollection: IUniversite[] = [sampleWithRequiredData];
        expectedResult = service.addUniversiteToCollectionIfMissing(universiteCollection, undefined, null);
        expect(expectedResult).toEqual(universiteCollection);
      });
    });

    describe('compareUniversite', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUniversite(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUniversite(entity1, entity2);
        const compareResult2 = service.compareUniversite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUniversite(entity1, entity2);
        const compareResult2 = service.compareUniversite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUniversite(entity1, entity2);
        const compareResult2 = service.compareUniversite(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
