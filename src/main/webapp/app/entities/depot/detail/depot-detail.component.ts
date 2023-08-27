import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDepot } from '../depot.model';

@Component({
  selector: 'jhi-depot-detail',
  templateUrl: './depot-detail.component.html',
})
export class DepotDetailComponent implements OnInit {
  depot: IDepot | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ depot }) => {
      this.depot = depot;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
