import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CampagneFormService } from './campagne-form.service';
import { CampagneService } from '../service/campagne.service';
import { ICampagne } from '../campagne.model';
import { IDossier } from 'app/entities/dossier/dossier.model';
import { DossierService } from 'app/entities/dossier/service/dossier.service';

import { CampagneUpdateComponent } from './campagne-update.component';

describe('Campagne Management Update Component', () => {
  let comp: CampagneUpdateComponent;
  let fixture: ComponentFixture<CampagneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let campagneFormService: CampagneFormService;
  let campagneService: CampagneService;
  let dossierService: DossierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CampagneUpdateComponent],
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
      .overrideTemplate(CampagneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CampagneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    campagneFormService = TestBed.inject(CampagneFormService);
    campagneService = TestBed.inject(CampagneService);
    dossierService = TestBed.inject(DossierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dossier query and add missing value', () => {
      const campagne: ICampagne = { id: 456 };
      const dossier: IDossier = { id: 28241 };
      campagne.dossier = dossier;

      const dossierCollection: IDossier[] = [{ id: 60491 }];
      jest.spyOn(dossierService, 'query').mockReturnValue(of(new HttpResponse({ body: dossierCollection })));
      const additionalDossiers = [dossier];
      const expectedCollection: IDossier[] = [...additionalDossiers, ...dossierCollection];
      jest.spyOn(dossierService, 'addDossierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ campagne });
      comp.ngOnInit();

      expect(dossierService.query).toHaveBeenCalled();
      expect(dossierService.addDossierToCollectionIfMissing).toHaveBeenCalledWith(
        dossierCollection,
        ...additionalDossiers.map(expect.objectContaining)
      );
      expect(comp.dossiersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const campagne: ICampagne = { id: 456 };
      const dossier: IDossier = { id: 46518 };
      campagne.dossier = dossier;

      activatedRoute.data = of({ campagne });
      comp.ngOnInit();

      expect(comp.dossiersSharedCollection).toContain(dossier);
      expect(comp.campagne).toEqual(campagne);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICampagne>>();
      const campagne = { id: 123 };
      jest.spyOn(campagneFormService, 'getCampagne').mockReturnValue(campagne);
      jest.spyOn(campagneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ campagne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: campagne }));
      saveSubject.complete();

      // THEN
      expect(campagneFormService.getCampagne).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(campagneService.update).toHaveBeenCalledWith(expect.objectContaining(campagne));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICampagne>>();
      const campagne = { id: 123 };
      jest.spyOn(campagneFormService, 'getCampagne').mockReturnValue({ id: null });
      jest.spyOn(campagneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ campagne: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: campagne }));
      saveSubject.complete();

      // THEN
      expect(campagneFormService.getCampagne).toHaveBeenCalled();
      expect(campagneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICampagne>>();
      const campagne = { id: 123 };
      jest.spyOn(campagneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ campagne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(campagneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDossier', () => {
      it('Should forward to dossierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dossierService, 'compareDossier');
        comp.compareDossier(entity, entity2);
        expect(dossierService.compareDossier).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
