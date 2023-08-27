import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UniversiteDetailComponent } from './universite-detail.component';

describe('Universite Management Detail Component', () => {
  let comp: UniversiteDetailComponent;
  let fixture: ComponentFixture<UniversiteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversiteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ universite: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UniversiteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UniversiteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load universite on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.universite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
