import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../niveau.test-samples';

import { NiveauFormService } from './niveau-form.service';

describe('Niveau Form Service', () => {
  let service: NiveauFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiveauFormService);
  });

  describe('Service methods', () => {
    describe('createNiveauFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNiveauFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            departement: expect.any(Object),
            dossier: expect.any(Object),
          })
        );
      });

      it('passing INiveau should create a new form with FormGroup', () => {
        const formGroup = service.createNiveauFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            departement: expect.any(Object),
            dossier: expect.any(Object),
          })
        );
      });
    });

    describe('getNiveau', () => {
      it('should return NewNiveau for default Niveau initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNiveauFormGroup(sampleWithNewData);

        const niveau = service.getNiveau(formGroup) as any;

        expect(niveau).toMatchObject(sampleWithNewData);
      });

      it('should return NewNiveau for empty Niveau initial value', () => {
        const formGroup = service.createNiveauFormGroup();

        const niveau = service.getNiveau(formGroup) as any;

        expect(niveau).toMatchObject({});
      });

      it('should return INiveau', () => {
        const formGroup = service.createNiveauFormGroup(sampleWithRequiredData);

        const niveau = service.getNiveau(formGroup) as any;

        expect(niveau).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INiveau should not enable id FormControl', () => {
        const formGroup = service.createNiveauFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNiveau should disable id FormControl', () => {
        const formGroup = service.createNiveauFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
