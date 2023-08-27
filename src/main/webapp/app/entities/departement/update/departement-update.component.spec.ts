import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DepartementFormService } from './departement-form.service';
import { DepartementService } from '../service/departement.service';
import { IDepartement } from '../departement.model';
import { IFaculte } from 'app/entities/faculte/faculte.model';
import { FaculteService } from 'app/entities/faculte/service/faculte.service';

import { DepartementUpdateComponent } from './departement-update.component';

describe('Departement Management Update Component', () => {
  let comp: DepartementUpdateComponent;
  let fixture: ComponentFixture<DepartementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let departementFormService: DepartementFormService;
  let departementService: DepartementService;
  let faculteService: FaculteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DepartementUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DepartementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DepartementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departementFormService = TestBed.inject(DepartementFormService);
    departementService = TestBed.inject(DepartementService);
    faculteService = TestBed.inject(FaculteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Faculte query and add missing value', () => {
      const departement: IDepartement = { id: 456 };
      const faculte: IFaculte = { id: 84591 };
      departement.faculte = faculte;

      const faculteCollection: IFaculte[] = [{ id: 67261 }];
      jest.spyOn(faculteService, 'query').mockReturnValue(of(new HttpResponse({ body: faculteCollection })));
      const additionalFacultes = [faculte];
      const expectedCollection: IFaculte[] = [...additionalFacultes, ...faculteCollection];
      jest.spyOn(faculteService, 'addFaculteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      expect(faculteService.query).toHaveBeenCalled();
      expect(faculteService.addFaculteToCollectionIfMissing).toHaveBeenCalledWith(
        faculteCollection,
        ...additionalFacultes.map(expect.objectContaining)
      );
      expect(comp.facultesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const departement: IDepartement = { id: 456 };
      const faculte: IFaculte = { id: 33876 };
      departement.faculte = faculte;

      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      expect(comp.facultesSharedCollection).toContain(faculte);
      expect(comp.departement).toEqual(departement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartement>>();
      const departement = { id: 123 };
      jest.spyOn(departementFormService, 'getDepartement').mockReturnValue(departement);
      jest.spyOn(departementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: departement }));
      saveSubject.complete();

      // THEN
      expect(departementFormService.getDepartement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departementService.update).toHaveBeenCalledWith(expect.objectContaining(departement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartement>>();
      const departement = { id: 123 };
      jest.spyOn(departementFormService, 'getDepartement').mockReturnValue({ id: null });
      jest.spyOn(departementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: departement }));
      saveSubject.complete();

      // THEN
      expect(departementFormService.getDepartement).toHaveBeenCalled();
      expect(departementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartement>>();
      const departement = { id: 123 };
      jest.spyOn(departementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFaculte', () => {
      it('Should forward to faculteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(faculteService, 'compareFaculte');
        comp.compareFaculte(entity, entity2);
        expect(faculteService.compareFaculte).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
