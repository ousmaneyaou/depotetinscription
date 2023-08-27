import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IInscription } from '../inscription.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../inscription.test-samples';

import { InscriptionService, RestInscription } from './inscription.service';

const requireRestSample: RestInscription = {
  ...sampleWithRequiredData,
  dateInscription: sampleWithRequiredData.dateInscription?.format(DATE_FORMAT),
};

describe('Inscription Service', () => {
  let service: InscriptionService;
  let httpMock: HttpTestingController;
  let expectedResult: IInscription | IInscription[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InscriptionService);
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

    it('should create a Inscription', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const inscription = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(inscription).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Inscription', () => {
      const inscription = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(inscription).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Inscription', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Inscription', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Inscription', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInscriptionToCollectionIfMissing', () => {
      it('should add a Inscription to an empty array', () => {
        const inscription: IInscription = sampleWithRequiredData;
        expectedResult = service.addInscriptionToCollectionIfMissing([], inscription);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inscription);
      });

      it('should not add a Inscription to an array that contains it', () => {
        const inscription: IInscription = sampleWithRequiredData;
        const inscriptionCollection: IInscription[] = [
          {
            ...inscription,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInscriptionToCollectionIfMissing(inscriptionCollection, inscription);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Inscription to an array that doesn't contain it", () => {
        const inscription: IInscription = sampleWithRequiredData;
        const inscriptionCollection: IInscription[] = [sampleWithPartialData];
        expectedResult = service.addInscriptionToCollectionIfMissing(inscriptionCollection, inscription);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inscription);
      });

      it('should add only unique Inscription to an array', () => {
        const inscriptionArray: IInscription[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const inscriptionCollection: IInscription[] = [sampleWithRequiredData];
        expectedResult = service.addInscriptionToCollectionIfMissing(inscriptionCollection, ...inscriptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const inscription: IInscription = sampleWithRequiredData;
        const inscription2: IInscription = sampleWithPartialData;
        expectedResult = service.addInscriptionToCollectionIfMissing([], inscription, inscription2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inscription);
        expect(expectedResult).toContain(inscription2);
      });

      it('should accept null and undefined values', () => {
        const inscription: IInscription = sampleWithRequiredData;
        expectedResult = service.addInscriptionToCollectionIfMissing([], null, inscription, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inscription);
      });

      it('should return initial array if no Inscription is added', () => {
        const inscriptionCollection: IInscription[] = [sampleWithRequiredData];
        expectedResult = service.addInscriptionToCollectionIfMissing(inscriptionCollection, undefined, null);
        expect(expectedResult).toEqual(inscriptionCollection);
      });
    });

    describe('compareInscription', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInscription(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInscription(entity1, entity2);
        const compareResult2 = service.compareInscription(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInscription(entity1, entity2);
        const compareResult2 = service.compareInscription(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInscription(entity1, entity2);
        const compareResult2 = service.compareInscription(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
