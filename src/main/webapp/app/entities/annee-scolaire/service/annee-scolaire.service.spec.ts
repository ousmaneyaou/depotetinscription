import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnneeScolaire } from '../annee-scolaire.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../annee-scolaire.test-samples';

import { AnneeScolaireService } from './annee-scolaire.service';

const requireRestSample: IAnneeScolaire = {
  ...sampleWithRequiredData,
};

describe('AnneeScolaire Service', () => {
  let service: AnneeScolaireService;
  let httpMock: HttpTestingController;
  let expectedResult: IAnneeScolaire | IAnneeScolaire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AnneeScolaireService);
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

    it('should create a AnneeScolaire', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const anneeScolaire = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(anneeScolaire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AnneeScolaire', () => {
      const anneeScolaire = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(anneeScolaire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AnneeScolaire', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AnneeScolaire', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AnneeScolaire', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAnneeScolaireToCollectionIfMissing', () => {
      it('should add a AnneeScolaire to an empty array', () => {
        const anneeScolaire: IAnneeScolaire = sampleWithRequiredData;
        expectedResult = service.addAnneeScolaireToCollectionIfMissing([], anneeScolaire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(anneeScolaire);
      });

      it('should not add a AnneeScolaire to an array that contains it', () => {
        const anneeScolaire: IAnneeScolaire = sampleWithRequiredData;
        const anneeScolaireCollection: IAnneeScolaire[] = [
          {
            ...anneeScolaire,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAnneeScolaireToCollectionIfMissing(anneeScolaireCollection, anneeScolaire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AnneeScolaire to an array that doesn't contain it", () => {
        const anneeScolaire: IAnneeScolaire = sampleWithRequiredData;
        const anneeScolaireCollection: IAnneeScolaire[] = [sampleWithPartialData];
        expectedResult = service.addAnneeScolaireToCollectionIfMissing(anneeScolaireCollection, anneeScolaire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(anneeScolaire);
      });

      it('should add only unique AnneeScolaire to an array', () => {
        const anneeScolaireArray: IAnneeScolaire[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const anneeScolaireCollection: IAnneeScolaire[] = [sampleWithRequiredData];
        expectedResult = service.addAnneeScolaireToCollectionIfMissing(anneeScolaireCollection, ...anneeScolaireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const anneeScolaire: IAnneeScolaire = sampleWithRequiredData;
        const anneeScolaire2: IAnneeScolaire = sampleWithPartialData;
        expectedResult = service.addAnneeScolaireToCollectionIfMissing([], anneeScolaire, anneeScolaire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(anneeScolaire);
        expect(expectedResult).toContain(anneeScolaire2);
      });

      it('should accept null and undefined values', () => {
        const anneeScolaire: IAnneeScolaire = sampleWithRequiredData;
        expectedResult = service.addAnneeScolaireToCollectionIfMissing([], null, anneeScolaire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(anneeScolaire);
      });

      it('should return initial array if no AnneeScolaire is added', () => {
        const anneeScolaireCollection: IAnneeScolaire[] = [sampleWithRequiredData];
        expectedResult = service.addAnneeScolaireToCollectionIfMissing(anneeScolaireCollection, undefined, null);
        expect(expectedResult).toEqual(anneeScolaireCollection);
      });
    });

    describe('compareAnneeScolaire', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAnneeScolaire(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAnneeScolaire(entity1, entity2);
        const compareResult2 = service.compareAnneeScolaire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAnneeScolaire(entity1, entity2);
        const compareResult2 = service.compareAnneeScolaire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAnneeScolaire(entity1, entity2);
        const compareResult2 = service.compareAnneeScolaire(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
