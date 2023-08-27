import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PaiementFormService, PaiementFormGroup } from './paiement-form.service';
import { IPaiement } from '../paiement.model';
import { PaiementService } from '../service/paiement.service';
import { IInscription } from 'app/entities/inscription/inscription.model';
import { InscriptionService } from 'app/entities/inscription/service/inscription.service';

@Component({
  selector: 'jhi-paiement-update',
  templateUrl: './paiement-update.component.html',
})
export class PaiementUpdateComponent implements OnInit {
  isSaving = false;
  paiement: IPaiement | null = null;

  inscriptionsSharedCollection: IInscription[] = [];

  editForm: PaiementFormGroup = this.paiementFormService.createPaiementFormGroup();

  constructor(
    protected paiementService: PaiementService,
    protected paiementFormService: PaiementFormService,
    protected inscriptionService: InscriptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInscription = (o1: IInscription | null, o2: IInscription | null): boolean => this.inscriptionService.compareInscription(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paiement }) => {
      this.paiement = paiement;
      if (paiement) {
        this.updateForm(paiement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paiement = this.paiementFormService.getPaiement(this.editForm);
    if (paiement.id !== null) {
      this.subscribeToSaveResponse(this.paiementService.update(paiement));
    } else {
      this.subscribeToSaveResponse(this.paiementService.create(paiement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaiement>>): void {
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

  protected updateForm(paiement: IPaiement): void {
    this.paiement = paiement;
    this.paiementFormService.resetForm(this.editForm, paiement);

    this.inscriptionsSharedCollection = this.inscriptionService.addInscriptionToCollectionIfMissing<IInscription>(
      this.inscriptionsSharedCollection,
      paiement.inscription
    );
  }

  protected loadRelationshipsOptions(): void {
    this.inscriptionService
      .query()
      .pipe(map((res: HttpResponse<IInscription[]>) => res.body ?? []))
      .pipe(
        map((inscriptions: IInscription[]) =>
          this.inscriptionService.addInscriptionToCollectionIfMissing<IInscription>(inscriptions, this.paiement?.inscription)
        )
      )
      .subscribe((inscriptions: IInscription[]) => (this.inscriptionsSharedCollection = inscriptions));
  }
}
