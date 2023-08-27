import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FaculteFormService, FaculteFormGroup } from './faculte-form.service';
import { IFaculte } from '../faculte.model';
import { FaculteService } from '../service/faculte.service';
import { IUniversite } from 'app/entities/universite/universite.model';
import { UniversiteService } from 'app/entities/universite/service/universite.service';

@Component({
  selector: 'jhi-faculte-update',
  templateUrl: './faculte-update.component.html',
})
export class FaculteUpdateComponent implements OnInit {
  isSaving = false;
  faculte: IFaculte | null = null;

  universitesSharedCollection: IUniversite[] = [];

  editForm: FaculteFormGroup = this.faculteFormService.createFaculteFormGroup();

  constructor(
    protected faculteService: FaculteService,
    protected faculteFormService: FaculteFormService,
    protected universiteService: UniversiteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUniversite = (o1: IUniversite | null, o2: IUniversite | null): boolean => this.universiteService.compareUniversite(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ faculte }) => {
      this.faculte = faculte;
      if (faculte) {
        this.updateForm(faculte);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const faculte = this.faculteFormService.getFaculte(this.editForm);
    if (faculte.id !== null) {
      this.subscribeToSaveResponse(this.faculteService.update(faculte));
    } else {
      this.subscribeToSaveResponse(this.faculteService.create(faculte));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFaculte>>): void {
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

  protected updateForm(faculte: IFaculte): void {
    this.faculte = faculte;
    this.faculteFormService.resetForm(this.editForm, faculte);

    this.universitesSharedCollection = this.universiteService.addUniversiteToCollectionIfMissing<IUniversite>(
      this.universitesSharedCollection,
      faculte.universite
    );
  }

  protected loadRelationshipsOptions(): void {
    this.universiteService
      .query()
      .pipe(map((res: HttpResponse<IUniversite[]>) => res.body ?? []))
      .pipe(
        map((universites: IUniversite[]) =>
          this.universiteService.addUniversiteToCollectionIfMissing<IUniversite>(universites, this.faculte?.universite)
        )
      )
      .subscribe((universites: IUniversite[]) => (this.universitesSharedCollection = universites));
  }
}
