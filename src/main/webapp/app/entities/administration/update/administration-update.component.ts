import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AdministrationFormService, AdministrationFormGroup } from './administration-form.service';
import { IAdministration } from '../administration.model';
import { AdministrationService } from '../service/administration.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-administration-update',
  templateUrl: './administration-update.component.html',
})
export class AdministrationUpdateComponent implements OnInit {
  isSaving = false;
  administration: IAdministration | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: AdministrationFormGroup = this.administrationFormService.createAdministrationFormGroup();

  constructor(
    protected administrationService: AdministrationService,
    protected administrationFormService: AdministrationFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administration }) => {
      this.administration = administration;
      if (administration) {
        this.updateForm(administration);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const administration = this.administrationFormService.getAdministration(this.editForm);
    if (administration.id !== null) {
      this.subscribeToSaveResponse(this.administrationService.update(administration));
    } else {
      this.subscribeToSaveResponse(this.administrationService.create(administration));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdministration>>): void {
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

  protected updateForm(administration: IAdministration): void {
    this.administration = administration;
    this.administrationFormService.resetForm(this.editForm, administration);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, administration.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.administration?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
