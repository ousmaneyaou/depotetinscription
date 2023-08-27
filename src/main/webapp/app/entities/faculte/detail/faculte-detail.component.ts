import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFaculte } from '../faculte.model';

@Component({
  selector: 'jhi-faculte-detail',
  templateUrl: './faculte-detail.component.html',
})
export class FaculteDetailComponent implements OnInit {
  faculte: IFaculte | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ faculte }) => {
      this.faculte = faculte;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
