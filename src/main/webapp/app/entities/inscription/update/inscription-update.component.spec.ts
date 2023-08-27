import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InscriptionFormService } from './inscription-form.service';
import { InscriptionService } from '../service/inscription.service';
import { IInscription } from '../inscription.model';
import { IDepot } from 'app/entities/depot/depot.model';
import { DepotService } from 'app/entities/depot/service/depot.service';
import { IAdministration } from 'app/entities/administration/administration.model';
import { AdministrationService } from 'app/entities/administration/service/administration.service';

import { InscriptionUpdateComponent } from './inscription-update.component';

describe('Inscription Management Update Component', () => {
  let comp: InscriptionUpdateComponent;
  let fixture: ComponentFixture<InscriptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let inscriptionFormService: InscriptionFormService;
  let inscriptionService: InscriptionService;
  let depotService: DepotService;
  let administrationService: AdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InscriptionUpdateComponent],
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
      .overrideTemplate(InscriptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InscriptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inscriptionFormService = TestBed.inject(InscriptionFormService);
    inscriptionService = TestBed.inject(InscriptionService);
    depotService = TestBed.inject(DepotService);
    administrationService = TestBed.inject(AdministrationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Depot query and add missing value', () => {
      const inscription: IInscription = { id: 456 };
      const depots: IDepot[] = [{ id: 29203 }];
      inscription.depots = depots;

      const depotCollection: IDepot[] = [{ id: 88751 }];
      jest.spyOn(depotService, 'query').mockReturnValue(of(new HttpResponse({ body: depotCollection })));
      const additionalDepots = [...depots];
      const expectedCollection: IDepot[] = [...additionalDepots, ...depotCollection];
      jest.spyOn(depotService, 'addDepotToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ inscription });
      comp.ngOnInit();

      expect(depotService.query).toHaveBeenCalled();
      expect(depotService.addDepotToCollectionIfMissing).toHaveBeenCalledWith(
        depotCollection,
        ...additionalDepots.map(expect.objectContaining)
      );
      expect(comp.depotsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Administration query and add missing value', () => {
      const inscription: IInscription = { id: 456 };
      const administration: IAdministration = { id: 86522 };
      inscription.administration = administration;

      const administrationCollection: IAdministration[] = [{ id: 28940 }];
      jest.spyOn(administrationService, 'query').mockReturnValue(of(new HttpResponse({ body: administrationCollection })));
      const additionalAdministrations = [administration];
      const expectedCollection: IAdministration[] = [...additionalAdministrations, ...administrationCollection];
      jest.spyOn(administrationService, 'addAdministrationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ inscription });
      comp.ngOnInit();

      expect(administrationService.query).toHaveBeenCalled();
      expect(administrationService.addAdministrationToCollectionIfMissing).toHaveBeenCalledWith(
        administrationCollection,
        ...additionalAdministrations.map(expect.objectContaining)
      );
      expect(comp.administrationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const inscription: IInscription = { id: 456 };
      const depot: IDepot = { id: 74293 };
      inscription.depots = [depot];
      const administration: IAdministration = { id: 7085 };
      inscription.administration = administration;

      activatedRoute.data = of({ inscription });
      comp.ngOnInit();

      expect(comp.depotsSharedCollection).toContain(depot);
      expect(comp.administrationsSharedCollection).toContain(administration);
      expect(comp.inscription).toEqual(inscription);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInscription>>();
      const inscription = { id: 123 };
      jest.spyOn(inscriptionFormService, 'getInscription').mockReturnValue(inscription);
      jest.spyOn(inscriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inscription }));
      saveSubject.complete();

      // THEN
      expect(inscriptionFormService.getInscription).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(inscriptionService.update).toHaveBeenCalledWith(expect.objectContaining(inscription));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInscription>>();
      const inscription = { id: 123 };
      jest.spyOn(inscriptionFormService, 'getInscription').mockReturnValue({ id: null });
      jest.spyOn(inscriptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inscription: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inscription }));
      saveSubject.complete();

      // THEN
      expect(inscriptionFormService.getInscription).toHaveBeenCalled();
      expect(inscriptionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInscription>>();
      const inscription = { id: 123 };
      jest.spyOn(inscriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(inscriptionService.update).toHaveBeenCalled();
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

    describe('compareAdministration', () => {
      it('Should forward to administrationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(administrationService, 'compareAdministration');
        comp.compareAdministration(entity, entity2);
        expect(administrationService.compareAdministration).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
