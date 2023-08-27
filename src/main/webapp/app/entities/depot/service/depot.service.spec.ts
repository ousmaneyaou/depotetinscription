import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDepot } from '../depot.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../depot.test-samples';

import { DepotService } from './depot.service';

const requireRestSample: IDepot = {
  ...sampleWithRequiredData,
};

describe('Depot Service', () => {
  let service: DepotService;
  let httpMock: HttpTestingController;
  let expectedResult: IDepot | IDepot[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DepotService);
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

    it('should create a Depot', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const depot = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(depot).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Depot', () => {
      const depot = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(depot).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Depot', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Depot', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Depot', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDepotToCollectionIfMissing', () => {
      it('should add a Depot to an empty array', () => {
        const depot: IDepot = sampleWithRequiredData;
        expectedResult = service.addDepotToCollectionIfMissing([], depot);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(depot);
      });

      it('should not add a Depot to an array that contains it', () => {
        const depot: IDepot = sampleWithRequiredData;
        const depotCollection: IDepot[] = [
          {
            ...depot,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDepotToCollectionIfMissing(depotCollection, depot);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Depot to an array that doesn't contain it", () => {
        const depot: IDepot = sampleWithRequiredData;
        const depotCollection: IDepot[] = [sampleWithPartialData];
        expectedResult = service.addDepotToCollectionIfMissing(depotCollection, depot);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(depot);
      });

      it('should add only unique Depot to an array', () => {
        const depotArray: IDepot[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const depotCollection: IDepot[] = [sampleWithRequiredData];
        expectedResult = service.addDepotToCollectionIfMissing(depotCollection, ...depotArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const depot: IDepot = sampleWithRequiredData;
        const depot2: IDepot = sampleWithPartialData;
        expectedResult = service.addDepotToCollectionIfMissing([], depot, depot2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(depot);
        expect(expectedResult).toContain(depot2);
      });

      it('should accept null and undefined values', () => {
        const depot: IDepot = sampleWithRequiredData;
        expectedResult = service.addDepotToCollectionIfMissing([], null, depot, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(depot);
      });

      it('should return initial array if no Depot is added', () => {
        const depotCollection: IDepot[] = [sampleWithRequiredData];
        expectedResult = service.addDepotToCollectionIfMissing(depotCollection, undefined, null);
        expect(expectedResult).toEqual(depotCollection);
      });
    });

    describe('compareDepot', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDepot(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDepot(entity1, entity2);
        const compareResult2 = service.compareDepot(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDepot(entity1, entity2);
        const compareResult2 = service.compareDepot(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDepot(entity1, entity2);
        const compareResult2 = service.compareDepot(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
