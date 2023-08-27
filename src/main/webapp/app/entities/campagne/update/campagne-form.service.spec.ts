import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../campagne.test-samples';

import { CampagneFormService } from './campagne-form.service';

describe('Campagne Form Service', () => {
  let service: CampagneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampagneFormService);
  });

  describe('Service methods', () => {
    describe('createCampagneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCampagneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            intitule: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            dossier: expect.any(Object),
          })
        );
      });

      it('passing ICampagne should create a new form with FormGroup', () => {
        const formGroup = service.createCampagneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            intitule: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            dossier: expect.any(Object),
          })
        );
      });
    });

    describe('getCampagne', () => {
      it('should return NewCampagne for default Campagne initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCampagneFormGroup(sampleWithNewData);

        const campagne = service.getCampagne(formGroup) as any;

        expect(campagne).toMatchObject(sampleWithNewData);
      });

      it('should return NewCampagne for empty Campagne initial value', () => {
        const formGroup = service.createCampagneFormGroup();

        const campagne = service.getCampagne(formGroup) as any;

        expect(campagne).toMatchObject({});
      });

      it('should return ICampagne', () => {
        const formGroup = service.createCampagneFormGroup(sampleWithRequiredData);

        const campagne = service.getCampagne(formGroup) as any;

        expect(campagne).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICampagne should not enable id FormControl', () => {
        const formGroup = service.createCampagneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCampagne should disable id FormControl', () => {
        const formGroup = service.createCampagneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
