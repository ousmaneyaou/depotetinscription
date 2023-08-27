import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../faculte.test-samples';

import { FaculteFormService } from './faculte-form.service';

describe('Faculte Form Service', () => {
  let service: FaculteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaculteFormService);
  });

  describe('Service methods', () => {
    describe('createFaculteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFaculteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            universite: expect.any(Object),
          })
        );
      });

      it('passing IFaculte should create a new form with FormGroup', () => {
        const formGroup = service.createFaculteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            universite: expect.any(Object),
          })
        );
      });
    });

    describe('getFaculte', () => {
      it('should return NewFaculte for default Faculte initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFaculteFormGroup(sampleWithNewData);

        const faculte = service.getFaculte(formGroup) as any;

        expect(faculte).toMatchObject(sampleWithNewData);
      });

      it('should return NewFaculte for empty Faculte initial value', () => {
        const formGroup = service.createFaculteFormGroup();

        const faculte = service.getFaculte(formGroup) as any;

        expect(faculte).toMatchObject({});
      });

      it('should return IFaculte', () => {
        const formGroup = service.createFaculteFormGroup(sampleWithRequiredData);

        const faculte = service.getFaculte(formGroup) as any;

        expect(faculte).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFaculte should not enable id FormControl', () => {
        const formGroup = service.createFaculteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFaculte should disable id FormControl', () => {
        const formGroup = service.createFaculteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
