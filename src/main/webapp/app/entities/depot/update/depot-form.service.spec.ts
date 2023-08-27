import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../depot.test-samples';

import { DepotFormService } from './depot-form.service';

describe('Depot Form Service', () => {
  let service: DepotFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotFormService);
  });

  describe('Service methods', () => {
    describe('createDepotFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDepotFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dossierValide: expect.any(Object),
            inscriptions: expect.any(Object),
            dossiers: expect.any(Object),
          })
        );
      });

      it('passing IDepot should create a new form with FormGroup', () => {
        const formGroup = service.createDepotFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dossierValide: expect.any(Object),
            inscriptions: expect.any(Object),
            dossiers: expect.any(Object),
          })
        );
      });
    });

    describe('getDepot', () => {
      it('should return NewDepot for default Depot initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDepotFormGroup(sampleWithNewData);

        const depot = service.getDepot(formGroup) as any;

        expect(depot).toMatchObject(sampleWithNewData);
      });

      it('should return NewDepot for empty Depot initial value', () => {
        const formGroup = service.createDepotFormGroup();

        const depot = service.getDepot(formGroup) as any;

        expect(depot).toMatchObject({});
      });

      it('should return IDepot', () => {
        const formGroup = service.createDepotFormGroup(sampleWithRequiredData);

        const depot = service.getDepot(formGroup) as any;

        expect(depot).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDepot should not enable id FormControl', () => {
        const formGroup = service.createDepotFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDepot should disable id FormControl', () => {
        const formGroup = service.createDepotFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
