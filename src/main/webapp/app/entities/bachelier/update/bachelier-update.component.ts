import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BachelierFormService, BachelierFormGroup } from './bachelier-form.service';
import { IBachelier } from '../bachelier.model';
import { BachelierService } from '../service/bachelier.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { EnumSexe } from 'app/entities/enumerations/enum-sexe.model';

@Component({
  selector: 'jhi-bachelier-update',
  templateUrl: './bachelier-update.component.html',
})
export class BachelierUpdateComponent implements OnInit {
  isSaving = false;
  bachelier: IBachelier | null = null;
  enumSexeValues = Object.keys(EnumSexe);

  usersSharedCollection: IUser[] = [];

  editForm: BachelierFormGroup = this.bachelierFormService.createBachelierFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected bachelierService: BachelierService,
    protected bachelierFormService: BachelierFormService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bachelier }) => {
      this.bachelier = bachelier;
      if (bachelier) {
        this.updateForm(bachelier);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('campusNigerApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bachelier = this.bachelierFormService.getBachelier(this.editForm);
    if (bachelier.id !== null) {
      this.subscribeToSaveResponse(this.bachelierService.update(bachelier));
    } else {
      this.subscribeToSaveResponse(this.bachelierService.create(bachelier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBachelier>>): void {
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

  protected updateForm(bachelier: IBachelier): void {
    this.bachelier = bachelier;
    this.bachelierFormService.resetForm(this.editForm, bachelier);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, bachelier.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.bachelier?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
