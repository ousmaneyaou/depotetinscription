import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdministrationFormService } from './administration-form.service';
import { AdministrationService } from '../service/administration.service';
import { IAdministration } from '../administration.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { AdministrationUpdateComponent } from './administration-update.component';

describe('Administration Management Update Component', () => {
  let comp: AdministrationUpdateComponent;
  let fixture: ComponentFixture<AdministrationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let administrationFormService: AdministrationFormService;
  let administrationService: AdministrationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdministrationUpdateComponent],
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
      .overrideTemplate(AdministrationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdministrationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    administrationFormService = TestBed.inject(AdministrationFormService);
    administrationService = TestBed.inject(AdministrationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const administration: IAdministration = { id: 456 };
      const user: IUser = { id: 38413 };
      administration.user = user;

      const userCollection: IUser[] = [{ id: 91230 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ administration });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const administration: IAdministration = { id: 456 };
      const user: IUser = { id: 22990 };
      administration.user = user;

      activatedRoute.data = of({ administration });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.administration).toEqual(administration);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdministration>>();
      const administration = { id: 123 };
      jest.spyOn(administrationFormService, 'getAdministration').mockReturnValue(administration);
      jest.spyOn(administrationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: administration }));
      saveSubject.complete();

      // THEN
      expect(administrationFormService.getAdministration).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(administrationService.update).toHaveBeenCalledWith(expect.objectContaining(administration));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdministration>>();
      const administration = { id: 123 };
      jest.spyOn(administrationFormService, 'getAdministration').mockReturnValue({ id: null });
      jest.spyOn(administrationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administration: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: administration }));
      saveSubject.complete();

      // THEN
      expect(administrationFormService.getAdministration).toHaveBeenCalled();
      expect(administrationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdministration>>();
      const administration = { id: 123 };
      jest.spyOn(administrationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(administrationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
