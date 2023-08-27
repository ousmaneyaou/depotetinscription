import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DepotFormService, DepotFormGroup } from './depot-form.service';
import { IDepot } from '../depot.model';
import { DepotService } from '../service/depot.service';

@Component({
  selector: 'jhi-depot-update',
  templateUrl: './depot-update.component.html',
})
export class DepotUpdateComponent implements OnInit {
  isSaving = false;
  depot: IDepot | null = null;

  editForm: DepotFormGroup = this.depotFormService.createDepotFormGroup();

  constructor(
    protected depotService: DepotService,
    protected depotFormService: DepotFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ depot }) => {
      this.depot = depot;
      if (depot) {
        this.updateForm(depot);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const depot = this.depotFormService.getDepot(this.editForm);
    if (depot.id !== null) {
      this.subscribeToSaveResponse(this.depotService.update(depot));
    } else {
      this.subscribeToSaveResponse(this.depotService.create(depot));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepot>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(depot: IDepot): void {
    this.depot = depot;
    this.depotFormService.resetForm(this.editForm, depot);
  }
}
