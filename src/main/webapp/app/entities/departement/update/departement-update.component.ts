import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DepartementFormService, DepartementFormGroup } from './departement-form.service';
import { IDepartement } from '../departement.model';
import { DepartementService } from '../service/departement.service';
import { IFaculte } from 'app/entities/faculte/faculte.model';
import { FaculteService } from 'app/entities/faculte/service/faculte.service';

@Component({
  selector: 'jhi-departement-update',
  templateUrl: './departement-update.component.html',
})
export class DepartementUpdateComponent implements OnInit {
  isSaving = false;
  departement: IDepartement | null = null;

  facultesSharedCollection: IFaculte[] = [];

  editForm: DepartementFormGroup = this.departementFormService.createDepartementFormGroup();

  constructor(
    protected departementService: DepartementService,
    protected departementFormService: DepartementFormService,
    protected faculteService: FaculteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFaculte = (o1: IFaculte | null, o2: IFaculte | null): boolean => this.faculteService.compareFaculte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ departement }) => {
      this.departement = departement;
      if (departement) {
        this.updateForm(departement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const departement = this.departementFormService.getDepartement(this.editForm);
    if (departement.id !== null) {
      this.subscribeToSaveResponse(this.departementService.update(departement));
    } else {
      this.subscribeToSaveResponse(this.departementService.create(departement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartement>>): void {
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

  protected updateForm(departement: IDepartement): void {
    this.departement = departement;
    this.departementFormService.resetForm(this.editForm, departement);

    this.facultesSharedCollection = this.faculteService.addFaculteToCollectionIfMissing<IFaculte>(
      this.facultesSharedCollection,
      departement.faculte
    );
  }

  protected loadRelationshipsOptions(): void {
    this.faculteService
      .query()
      .pipe(map((res: HttpResponse<IFaculte[]>) => res.body ?? []))
      .pipe(
        map((facultes: IFaculte[]) => this.faculteService.addFaculteToCollectionIfMissing<IFaculte>(facultes, this.departement?.faculte))
      )
      .subscribe((facultes: IFaculte[]) => (this.facultesSharedCollection = facultes));
  }
}
