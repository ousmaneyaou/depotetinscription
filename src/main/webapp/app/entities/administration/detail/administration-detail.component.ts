import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdministration } from '../administration.model';

@Component({
  selector: 'jhi-administration-detail',
  templateUrl: './administration-detail.component.html',
})
export class AdministrationDetailComponent implements OnInit {
  administration: IAdministration | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administration }) => {
      this.administration = administration;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
