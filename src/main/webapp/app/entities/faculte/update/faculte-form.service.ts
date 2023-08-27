import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFaculte, NewFaculte } from '../faculte.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFaculte for edit and NewFaculteFormGroupInput for create.
 */
type FaculteFormGroupInput = IFaculte | PartialWithRequiredKeyOf<NewFaculte>;

type FaculteFormDefaults = Pick<NewFaculte, 'id'>;

type FaculteFormGroupContent = {
  id: FormControl<IFaculte['id'] | NewFaculte['id']>;
  libelle: FormControl<IFaculte['libelle']>;
  universite: FormControl<IFaculte['universite']>;
};

export type FaculteFormGroup = FormGroup<FaculteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FaculteFormService {
  createFaculteFormGroup(faculte: FaculteFormGroupInput = { id: null }): FaculteFormGroup {
    const faculteRawValue = {
      ...this.getFormDefaults(),
      ...faculte,
    };
    return new FormGroup<FaculteFormGroupContent>({
      id: new FormControl(
        { value: faculteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelle: new FormControl(faculteRawValue.libelle),
      universite: new FormControl(faculteRawValue.universite),
    });
  }

  getFaculte(form: FaculteFormGroup): IFaculte | NewFaculte {
    return form.getRawValue() as IFaculte | NewFaculte;
  }

  resetForm(form: FaculteFormGroup, faculte: FaculteFormGroupInput): void {
    const faculteRawValue = { ...this.getFormDefaults(), ...faculte };
    form.reset(
      {
        ...faculteRawValue,
        id: { value: faculteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FaculteFormDefaults {
    return {
      id: null,
    };
  }
}
