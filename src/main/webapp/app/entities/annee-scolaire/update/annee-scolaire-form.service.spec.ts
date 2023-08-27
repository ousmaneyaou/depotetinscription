import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../annee-scolaire.test-samples';

import { AnneeScolaireFormService } from './annee-scolaire-form.service';

describe('AnneeScolaire Form Service', () => {
  let service: AnneeScolaireFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnneeScolaireFormService);
  });

  describe('Service methods', () => {
    describe('createAnneeScolaireFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAnneeScolaireFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            enCours: expect.any(Object),
            campagne: expect.any(Object),
          })
        );
      });

      it('passing IAnneeScolaire should create a new form with FormGroup', () => {
        const formGroup = service.createAnneeScolaireFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            enCours: expect.any(Object),
            campagne: expect.any(Object),
          })
        );
      });
    });

    describe('getAnneeScolaire', () => {
      it('should return NewAnneeScolaire for default AnneeScolaire initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAnneeScolaireFormGroup(sampleWithNewData);

        const anneeScolaire = service.getAnneeScolaire(formGroup) as any;

        expect(anneeScolaire).toMatchObject(sampleWithNewData);
      });

      it('should return NewAnneeScolaire for empty AnneeScolaire initial value', () => {
        const formGroup = service.createAnneeScolaireFormGroup();

        const anneeScolaire = service.getAnneeScolaire(formGroup) as any;

        expect(anneeScolaire).toMatchObject({});
      });

      it('should return IAnneeScolaire', () => {
        const formGroup = service.createAnneeScolaireFormGroup(sampleWithRequiredData);

        const anneeScolaire = service.getAnneeScolaire(formGroup) as any;

        expect(anneeScolaire).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAnneeScolaire should not enable id FormControl', () => {
        const formGroup = service.createAnneeScolaireFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAnneeScolaire should disable id FormControl', () => {
        const formGroup = service.createAnneeScolaireFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
