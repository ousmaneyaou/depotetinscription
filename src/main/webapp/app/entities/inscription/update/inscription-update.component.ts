import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { InscriptionFormService, InscriptionFormGroup } from './inscription-form.service';
import { IInscription } from '../inscription.model';
import { InscriptionService } from '../service/inscription.service';
import { IDepot } from 'app/entities/depot/depot.model';
import { DepotService } from 'app/entities/depot/service/depot.service';

@Component({
  selector: 'jhi-inscription-update',
  templateUrl: './inscription-update.component.html',
})
export class InscriptionUpdateComponent implements OnInit {
  isSaving = false;
  inscription: IInscription | null = null;

  depotsSharedCollection: IDepot[] = [];

  editForm: InscriptionFormGroup = this.inscriptionFormService.createInscriptionFormGroup();

  constructor(
    protected inscriptionService: InscriptionService,
    protected inscriptionFormService: InscriptionFormService,
    protected depotService: DepotService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDepot = (o1: IDepot | null, o2: IDepot | null): boolean => this.depotService.compareDepot(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inscription }) => {
      this.inscription = inscription;
      if (inscription) {
        this.updateForm(inscription);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inscription = this.inscriptionFormService.getInscription(this.editForm);
    if (inscription.id !== null) {
      this.subscribeToSaveResponse(this.inscriptionService.update(inscription));
    } else {
      this.subscribeToSaveResponse(this.inscriptionService.create(inscription));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInscription>>): void {
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

  protected updateForm(inscription: IInscription): void {
    this.inscription = inscription;
    this.inscriptionFormService.resetForm(this.editForm, inscription);

    this.depotsSharedCollection = this.depotService.addDepotToCollectionIfMissing<IDepot>(
      this.depotsSharedCollection,
      ...(inscription.depots ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.depotService
      .query()
      .pipe(map((res: HttpResponse<IDepot[]>) => res.body ?? []))
      .pipe(map((depots: IDepot[]) => this.depotService.addDepotToCollectionIfMissing<IDepot>(depots, ...(this.inscription?.depots ?? []))))
      .subscribe((depots: IDepot[]) => (this.depotsSharedCollection = depots));
  }
}
