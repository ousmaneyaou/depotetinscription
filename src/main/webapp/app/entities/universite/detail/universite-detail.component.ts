import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUniversite } from '../universite.model';

@Component({
  selector: 'jhi-universite-detail',
  templateUrl: './universite-detail.component.html',
})
export class UniversiteDetailComponent implements OnInit {
  universite: IUniversite | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ universite }) => {
      this.universite = universite;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
