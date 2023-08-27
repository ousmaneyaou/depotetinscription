import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CampagneFormService, CampagneFormGroup } from './campagne-form.service';
import { ICampagne } from '../campagne.model';
import { CampagneService } from '../service/campagne.service';
import { IDossier } from 'app/entities/dossier/dossier.model';
import { DossierService } from 'app/entities/dossier/service/dossier.service';

@Component({
  selector: 'jhi-campagne-update',
  templateUrl: './campagne-update.component.html',
})
export class CampagneUpdateComponent implements OnInit {
  isSaving = false;
  campagne: ICampagne | null = null;

  dossiersSharedCollection: IDossier[] = [];

  editForm: CampagneFormGroup = this.campagneFormService.createCampagneFormGroup();

  constructor(
    protected campagneService: CampagneService,
    protected campagneFormService: CampagneFormService,
    protected dossierService: DossierService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDossier = (o1: IDossier | null, o2: IDossier | null): boolean => this.dossierService.compareDossier(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campagne }) => {
      this.campagne = campagne;
      if (campagne) {
        this.updateForm(campagne);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const campagne = this.campagneFormService.getCampagne(this.editForm);
    if (campagne.id !== null) {
      this.subscribeToSaveResponse(this.campagneService.update(campagne));
    } else {
      this.subscribeToSaveResponse(this.campagneService.create(campagne));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICampagne>>): void {
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

  protected updateForm(campagne: ICampagne): void {
    this.campagne = campagne;
    this.campagneFormService.resetForm(this.editForm, campagne);

    this.dossiersSharedCollection = this.dossierService.addDossierToCollectionIfMissing<IDossier>(
      this.dossiersSharedCollection,
      campagne.dossier
    );
  }

  protected loadRelationshipsOptions(): void {
    this.dossierService
      .query()
      .pipe(map((res: HttpResponse<IDossier[]>) => res.body ?? []))
      .pipe(map((dossiers: IDossier[]) => this.dossierService.addDossierToCollectionIfMissing<IDossier>(dossiers, this.campagne?.dossier)))
      .subscribe((dossiers: IDossier[]) => (this.dossiersSharedCollection = dossiers));
  }
}
