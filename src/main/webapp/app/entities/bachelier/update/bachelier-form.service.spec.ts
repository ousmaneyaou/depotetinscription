import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bachelier.test-samples';

import { BachelierFormService } from './bachelier-form.service';

describe('Bachelier Form Service', () => {
  let service: BachelierFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BachelierFormService);
  });

  describe('Service methods', () => {
    describe('createBachelierFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBachelierFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sexe: expect.any(Object),
            dateNaissance: expect.any(Object),
            lieuNaissance: expect.any(Object),
            nationalite: expect.any(Object),
            telephone: expect.any(Object),
            numeroTable: expect.any(Object),
            serie: expect.any(Object),
            diplome: expect.any(Object),
            numeroTelephone1: expect.any(Object),
            anneeObtention: expect.any(Object),
            lieuObtention: expect.any(Object),
            mention: expect.any(Object),
            choix1: expect.any(Object),
            choix2: expect.any(Object),
            choix3: expect.any(Object),
            photo: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IBachelier should create a new form with FormGroup', () => {
        const formGroup = service.createBachelierFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sexe: expect.any(Object),
            dateNaissance: expect.any(Object),
            lieuNaissance: expect.any(Object),
            nationalite: expect.any(Object),
            telephone: expect.any(Object),
            numeroTable: expect.any(Object),
            serie: expect.any(Object),
            diplome: expect.any(Object),
            numeroTelephone1: expect.any(Object),
            anneeObtention: expect.any(Object),
            lieuObtention: expect.any(Object),
            mention: expect.any(Object),
            choix1: expect.any(Object),
            choix2: expect.any(Object),
            choix3: expect.any(Object),
            photo: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getBachelier', () => {
      it('should return NewBachelier for default Bachelier initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBachelierFormGroup(sampleWithNewData);

        const bachelier = service.getBachelier(formGroup) as any;

        expect(bachelier).toMatchObject(sampleWithNewData);
      });

      it('should return NewBachelier for empty Bachelier initial value', () => {
        const formGroup = service.createBachelierFormGroup();

        const bachelier = service.getBachelier(formGroup) as any;

        expect(bachelier).toMatchObject({});
      });

      it('should return IBachelier', () => {
        const formGroup = service.createBachelierFormGroup(sampleWithRequiredData);

        const bachelier = service.getBachelier(formGroup) as any;

        expect(bachelier).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBachelier should not enable id FormControl', () => {
        const formGroup = service.createBachelierFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBachelier should disable id FormControl', () => {
        const formGroup = service.createBachelierFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
