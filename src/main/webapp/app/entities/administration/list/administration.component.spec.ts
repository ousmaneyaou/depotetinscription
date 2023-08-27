import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AdministrationService } from '../service/administration.service';

import { AdministrationComponent } from './administration.component';

describe('Administration Management Component', () => {
  let comp: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;
  let service: AdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'administration', component: AdministrationComponent }]), HttpClientTestingModule],
      declarations: [AdministrationComponent],
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
      .overrideTemplate(AdministrationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdministrationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdministrationService);

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
    expect(comp.administrations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to administrationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAdministrationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAdministrationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
