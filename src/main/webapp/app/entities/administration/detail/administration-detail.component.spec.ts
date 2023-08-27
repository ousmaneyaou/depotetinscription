import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdministrationDetailComponent } from './administration-detail.component';

describe('Administration Management Detail Component', () => {
  let comp: AdministrationDetailComponent;
  let fixture: ComponentFixture<AdministrationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ administration: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdministrationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdministrationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load administration on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.administration).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
