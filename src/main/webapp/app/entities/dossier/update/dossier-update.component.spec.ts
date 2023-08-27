import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DossierFormService } from './dossier-form.service';
import { DossierService } from '../service/dossier.service';
import { IDossier } from '../dossier.model';
import { IDepot } from 'app/entities/depot/depot.model';
import { DepotService } from 'app/entities/depot/service/depot.service';

import { DossierUpdateComponent } from './dossier-update.component';

describe('Dossier Management Update Component', () => {
  let comp: DossierUpdateComponent;
  let fixture: ComponentFixture<DossierUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dossierFormService: DossierFormService;
  let dossierService: DossierService;
  let depotService: DepotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DossierUpdateComponent],
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
      .overrideTemplate(DossierUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DossierUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dossierFormService = TestBed.inject(DossierFormService);
    dossierService = TestBed.inject(DossierService);
    depotService = TestBed.inject(DepotService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Depot query and add missing value', () => {
      const dossier: IDossier = { id: 456 };
      const depots: IDepot[] = [{ id: 54127 }];
      dossier.depots = depots;

      const depotCollection: IDepot[] = [{ id: 22855 }];
      jest.spyOn(depotService, 'query').mockReturnValue(of(new HttpResponse({ body: depotCollection })));
      const additionalDepots = [...depots];
      const expectedCollection: IDepot[] = [...additionalDepots, ...depotCollection];
      jest.spyOn(depotService, 'addDepotToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(depotService.query).toHaveBeenCalled();
      expect(depotService.addDepotToCollectionIfMissing).toHaveBeenCalledWith(
        depotCollection,
        ...additionalDepots.map(expect.objectContaining)
      );
      expect(comp.depotsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const dossier: IDossier = { id: 456 };
      const depot: IDepot = { id: 86617 };
      dossier.depots = [depot];

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(comp.depotsSharedCollection).toContain(depot);
      expect(comp.dossier).toEqual(dossier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDossier>>();
      const dossier = { id: 123 };
      jest.spyOn(dossierFormService, 'getDossier').mockReturnValue(dossier);
      jest.spyOn(dossierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dossier }));
      saveSubject.complete();

      // THEN
      expect(dossierFormService.getDossier).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dossierService.update).toHaveBeenCalledWith(expect.objectContaining(dossier));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDossier>>();
      const dossier = { id: 123 };
      jest.spyOn(dossierFormService, 'getDossier').mockReturnValue({ id: null });
      jest.spyOn(dossierService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dossier: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dossier }));
      saveSubject.complete();

      // THEN
      expect(dossierFormService.getDossier).toHaveBeenCalled();
      expect(dossierService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDossier>>();
      const dossier = { id: 123 };
      jest.spyOn(dossierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dossierService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepot', () => {
      it('Should forward to depotService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(depotService, 'compareDepot');
        comp.compareDepot(entity, entity2);
        expect(depotService.compareDepot).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
