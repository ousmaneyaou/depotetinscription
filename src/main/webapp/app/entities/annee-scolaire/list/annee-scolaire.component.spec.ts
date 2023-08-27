import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AnneeScolaireService } from '../service/annee-scolaire.service';

import { AnneeScolaireComponent } from './annee-scolaire.component';

describe('AnneeScolaire Management Component', () => {
  let comp: AnneeScolaireComponent;
  let fixture: ComponentFixture<AnneeScolaireComponent>;
  let service: AnneeScolaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'annee-scolaire', component: AnneeScolaireComponent }]), HttpClientTestingModule],
      declarations: [AnneeScolaireComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AnneeScolaireComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnneeScolaireComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AnneeScolaireService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.anneeScolaires?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to anneeScolaireService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAnneeScolaireIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAnneeScolaireIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
