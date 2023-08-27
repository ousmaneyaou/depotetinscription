import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FaculteDetailComponent } from './faculte-detail.component';

describe('Faculte Management Detail Component', () => {
  let comp: FaculteDetailComponent;
  let fixture: ComponentFixture<FaculteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaculteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ faculte: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FaculteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FaculteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load faculte on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.faculte).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
