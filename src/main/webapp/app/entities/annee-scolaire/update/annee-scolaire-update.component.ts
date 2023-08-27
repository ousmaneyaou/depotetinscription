import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AnneeScolaireFormService, AnneeScolaireFormGroup } from './annee-scolaire-form.service';
import { IAnneeScolaire } from '../annee-scolaire.model';
import { AnneeScolaireService } from '../service/annee-scolaire.service';
import { ICampagne } from 'app/entities/campagne/campagne.model';
import { CampagneService } from 'app/entities/campagne/service/campagne.service';

@Component({
  selector: 'jhi-annee-scolaire-update',
  templateUrl: './annee-scolaire-update.component.html',
})
export class AnneeScolaireUpdateComponent implements OnInit {
  isSaving = false;
  anneeScolaire: IAnneeScolaire | null = null;

  campagnesSharedCollection: ICampagne[] = [];

  editForm: AnneeScolaireFormGroup = this.anneeScolaireFormService.createAnneeScolaireFormGroup();

  constructor(
    protected anneeScolaireService: AnneeScolaireService,
    protected anneeScolaireFormService: AnneeScolaireFormService,
    protected campagneService: CampagneService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCampagne = (o1: ICampagne | null, o2: ICampagne | null): boolean => this.campagneService.compareCampagne(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ anneeScolaire }) => {
      this.anneeScolaire = anneeScolaire;
      if (anneeScolaire) {
        this.updateForm(anneeScolaire);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const anneeScolaire = this.anneeScolaireFormService.getAnneeScolaire(this.editForm);
    if (anneeScolaire.id !== null) {
      this.subscribeToSaveResponse(this.anneeScolaireService.update(anneeScolaire));
    } else {
      this.subscribeToSaveResponse(this.anneeScolaireService.create(anneeScolaire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnneeScolaire>>): void {
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

  protected updateForm(anneeScolaire: IAnneeScolaire): void {
    this.anneeScolaire = anneeScolaire;
    this.anneeScolaireFormService.resetForm(this.editForm, anneeScolaire);

    this.campagnesSharedCollection = this.campagneService.addCampagneToCollectionIfMissing<ICampagne>(
      this.campagnesSharedCollection,
      anneeScolaire.campagne
    );
  }

  protected loadRelationshipsOptions(): void {
    this.campagneService
      .query()
      .pipe(map((res: HttpResponse<ICampagne[]>) => res.body ?? []))
      .pipe(
        map((campagnes: ICampagne[]) =>
          this.campagneService.addCampagneToCollectionIfMissing<ICampagne>(campagnes, this.anneeScolaire?.campagne)
        )
      )
      .subscribe((campagnes: ICampagne[]) => (this.campagnesSharedCollection = campagnes));
  }
}
