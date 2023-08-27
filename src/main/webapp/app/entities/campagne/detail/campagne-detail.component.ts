import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICampagne } from '../campagne.model';

@Component({
  selector: 'jhi-campagne-detail',
  templateUrl: './campagne-detail.component.html',
})
export class CampagneDetailComponent implements OnInit {
  campagne: ICampagne | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campagne }) => {
      this.campagne = campagne;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
