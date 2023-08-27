import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../universite.test-samples';

import { UniversiteFormService } from './universite-form.service';

describe('Universite Form Service', () => {
  let service: UniversiteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversiteFormService);
  });

  describe('Service methods', () => {
    describe('createUniversiteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUniversiteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
          })
        );
      });

      it('passing IUniversite should create a new form with FormGroup', () => {
        const formGroup = service.createUniversiteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
          })
        );
      });
    });

    describe('getUniversite', () => {
      it('should return NewUniversite for default Universite initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUniversiteFormGroup(sampleWithNewData);

        const universite = service.getUniversite(formGroup) as any;

        expect(universite).toMatchObject(sampleWithNewData);
      });

      it('should return NewUniversite for empty Universite initial value', () => {
        const formGroup = service.createUniversiteFormGroup();

        const universite = service.getUniversite(formGroup) as any;

        expect(universite).toMatchObject({});
      });

      it('should return IUniversite', () => {
        const formGroup = service.createUniversiteFormGroup(sampleWithRequiredData);

        const universite = service.getUniversite(formGroup) as any;

        expect(universite).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUniversite should not enable id FormControl', () => {
        const formGroup = service.createUniversiteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUniversite should disable id FormControl', () => {
        const formGroup = service.createUniversiteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
