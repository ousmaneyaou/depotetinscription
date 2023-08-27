import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AnneeScolaireFormService } from './annee-scolaire-form.service';
import { AnneeScolaireService } from '../service/annee-scolaire.service';
import { IAnneeScolaire } from '../annee-scolaire.model';
import { ICampagne } from 'app/entities/campagne/campagne.model';
import { CampagneService } from 'app/entities/campagne/service/campagne.service';

import { AnneeScolaireUpdateComponent } from './annee-scolaire-update.component';

describe('AnneeScolaire Management Update Component', () => {
  let comp: AnneeScolaireUpdateComponent;
  let fixture: ComponentFixture<AnneeScolaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let anneeScolaireFormService: AnneeScolaireFormService;
  let anneeScolaireService: AnneeScolaireService;
  let campagneService: CampagneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AnneeScolaireUpdateComponent],
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
      .overrideTemplate(AnneeScolaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnneeScolaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    anneeScolaireFormService = TestBed.inject(AnneeScolaireFormService);
    anneeScolaireService = TestBed.inject(AnneeScolaireService);
    campagneService = TestBed.inject(CampagneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Campagne query and add missing value', () => {
      const anneeScolaire: IAnneeScolaire = { id: 456 };
      const campagne: ICampagne = { id: 11841 };
      anneeScolaire.campagne = campagne;

      const campagneCollection: ICampagne[] = [{ id: 84866 }];
      jest.spyOn(campagneService, 'query').mockReturnValue(of(new HttpResponse({ body: campagneCollection })));
      const additionalCampagnes = [campagne];
      const expectedCollection: ICampagne[] = [...additionalCampagnes, ...campagneCollection];
      jest.spyOn(campagneService, 'addCampagneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ anneeScolaire });
      comp.ngOnInit();

      expect(campagneService.query).toHaveBeenCalled();
      expect(campagneService.addCampagneToCollectionIfMissing).toHaveBeenCalledWith(
        campagneCollection,
        ...additionalCampagnes.map(expect.objectContaining)
      );
      expect(comp.campagnesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const anneeScolaire: IAnneeScolaire = { id: 456 };
      const campagne: ICampagne = { id: 72180 };
      anneeScolaire.campagne = campagne;

      activatedRoute.data = of({ anneeScolaire });
      comp.ngOnInit();

      expect(comp.campagnesSharedCollection).toContain(campagne);
      expect(comp.anneeScolaire).toEqual(anneeScolaire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnneeScolaire>>();
      const anneeScolaire = { id: 123 };
      jest.spyOn(anneeScolaireFormService, 'getAnneeScolaire').mockReturnValue(anneeScolaire);
      jest.spyOn(anneeScolaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anneeScolaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: anneeScolaire }));
      saveSubject.complete();

      // THEN
      expect(anneeScolaireFormService.getAnneeScolaire).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(anneeScolaireService.update).toHaveBeenCalledWith(expect.objectContaining(anneeScolaire));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnneeScolaire>>();
      const anneeScolaire = { id: 123 };
      jest.spyOn(anneeScolaireFormService, 'getAnneeScolaire').mockReturnValue({ id: null });
      jest.spyOn(anneeScolaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anneeScolaire: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: anneeScolaire }));
      saveSubject.complete();

      // THEN
      expect(anneeScolaireFormService.getAnneeScolaire).toHaveBeenCalled();
      expect(anneeScolaireService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnneeScolaire>>();
      const anneeScolaire = { id: 123 };
      jest.spyOn(anneeScolaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anneeScolaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(anneeScolaireService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCampagne', () => {
      it('Should forward to campagneService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(campagneService, 'compareCampagne');
        comp.compareCampagne(entity, entity2);
        expect(campagneService.compareCampagne).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
