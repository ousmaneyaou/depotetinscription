import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICampagne } from '../campagne.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../campagne.test-samples';

import { CampagneService, RestCampagne } from './campagne.service';

const requireRestSample: RestCampagne = {
  ...sampleWithRequiredData,
  dateDebut: sampleWithRequiredData.dateDebut?.format(DATE_FORMAT),
  dateFin: sampleWithRequiredData.dateFin?.format(DATE_FORMAT),
};

describe('Campagne Service', () => {
  let service: CampagneService;
  let httpMock: HttpTestingController;
  let expectedResult: ICampagne | ICampagne[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CampagneService);
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

    it('should create a Campagne', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const campagne = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(campagne).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Campagne', () => {
      const campagne = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(campagne).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Campagne', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Campagne', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Campagne', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCampagneToCollectionIfMissing', () => {
      it('should add a Campagne to an empty array', () => {
        const campagne: ICampagne = sampleWithRequiredData;
        expectedResult = service.addCampagneToCollectionIfMissing([], campagne);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(campagne);
      });

      it('should not add a Campagne to an array that contains it', () => {
        const campagne: ICampagne = sampleWithRequiredData;
        const campagneCollection: ICampagne[] = [
          {
            ...campagne,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCampagneToCollectionIfMissing(campagneCollection, campagne);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Campagne to an array that doesn't contain it", () => {
        const campagne: ICampagne = sampleWithRequiredData;
        const campagneCollection: ICampagne[] = [sampleWithPartialData];
        expectedResult = service.addCampagneToCollectionIfMissing(campagneCollection, campagne);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(campagne);
      });

      it('should add only unique Campagne to an array', () => {
        const campagneArray: ICampagne[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const campagneCollection: ICampagne[] = [sampleWithRequiredData];
        expectedResult = service.addCampagneToCollectionIfMissing(campagneCollection, ...campagneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const campagne: ICampagne = sampleWithRequiredData;
        const campagne2: ICampagne = sampleWithPartialData;
        expectedResult = service.addCampagneToCollectionIfMissing([], campagne, campagne2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(campagne);
        expect(expectedResult).toContain(campagne2);
      });

      it('should accept null and undefined values', () => {
        const campagne: ICampagne = sampleWithRequiredData;
        expectedResult = service.addCampagneToCollectionIfMissing([], null, campagne, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(campagne);
      });

      it('should return initial array if no Campagne is added', () => {
        const campagneCollection: ICampagne[] = [sampleWithRequiredData];
        expectedResult = service.addCampagneToCollectionIfMissing(campagneCollection, undefined, null);
        expect(expectedResult).toEqual(campagneCollection);
      });
    });

    describe('compareCampagne', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCampagne(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCampagne(entity1, entity2);
        const compareResult2 = service.compareCampagne(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCampagne(entity1, entity2);
        const compareResult2 = service.compareCampagne(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCampagne(entity1, entity2);
        const compareResult2 = service.compareCampagne(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
