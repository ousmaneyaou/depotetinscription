import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DepotDetailComponent } from './depot-detail.component';

describe('Depot Management Detail Component', () => {
  let comp: DepotDetailComponent;
  let fixture: ComponentFixture<DepotDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepotDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ depot: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DepotDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DepotDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load depot on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.depot).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
