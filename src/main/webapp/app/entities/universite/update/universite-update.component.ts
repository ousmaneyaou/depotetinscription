import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UniversiteFormService, UniversiteFormGroup } from './universite-form.service';
import { IUniversite } from '../universite.model';
import { UniversiteService } from '../service/universite.service';

@Component({
  selector: 'jhi-universite-update',
  templateUrl: './universite-update.component.html',
})
export class UniversiteUpdateComponent implements OnInit {
  isSaving = false;
  universite: IUniversite | null = null;

  editForm: UniversiteFormGroup = this.universiteFormService.createUniversiteFormGroup();

  constructor(
    protected universiteService: UniversiteService,
    protected universiteFormService: UniversiteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ universite }) => {
      this.universite = universite;
      if (universite) {
        this.updateForm(universite);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const universite = this.universiteFormService.getUniversite(this.editForm);
    if (universite.id !== null) {
      this.subscribeToSaveResponse(this.universiteService.update(universite));
    } else {
      this.subscribeToSaveResponse(this.universiteService.create(universite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUniversite>>): void {
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

  protected updateForm(universite: IUniversite): void {
    this.universite = universite;
    this.universiteFormService.resetForm(this.editForm, universite);
  }
}
