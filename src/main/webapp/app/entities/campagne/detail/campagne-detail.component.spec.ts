import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CampagneDetailComponent } from './campagne-detail.component';

describe('Campagne Management Detail Component', () => {
  let comp: CampagneDetailComponent;
  let fixture: ComponentFixture<CampagneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampagneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ campagne: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CampagneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CampagneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load campagne on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.campagne).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
