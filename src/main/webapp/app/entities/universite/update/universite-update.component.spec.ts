import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UniversiteFormService } from './universite-form.service';
import { UniversiteService } from '../service/universite.service';
import { IUniversite } from '../universite.model';

import { UniversiteUpdateComponent } from './universite-update.component';

describe('Universite Management Update Component', () => {
  let comp: UniversiteUpdateComponent;
  let fixture: ComponentFixture<UniversiteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let universiteFormService: UniversiteFormService;
  let universiteService: UniversiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UniversiteUpdateComponent],
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
      .overrideTemplate(UniversiteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UniversiteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    universiteFormService = TestBed.inject(UniversiteFormService);
    universiteService = TestBed.inject(UniversiteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const universite: IUniversite = { id: 456 };

      activatedRoute.data = of({ universite });
      comp.ngOnInit();

      expect(comp.universite).toEqual(universite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUniversite>>();
      const universite = { id: 123 };
      jest.spyOn(universiteFormService, 'getUniversite').mockReturnValue(universite);
      jest.spyOn(universiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ universite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: universite }));
      saveSubject.complete();

      // THEN
      expect(universiteFormService.getUniversite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(universiteService.update).toHaveBeenCalledWith(expect.objectContaining(universite));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUniversite>>();
      const universite = { id: 123 };
      jest.spyOn(universiteFormService, 'getUniversite').mockReturnValue({ id: null });
      jest.spyOn(universiteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ universite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: universite }));
      saveSubject.complete();

      // THEN
      expect(universiteFormService.getUniversite).toHaveBeenCalled();
      expect(universiteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUniversite>>();
      const universite = { id: 123 };
      jest.spyOn(universiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ universite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(universiteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
