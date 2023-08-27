import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUniversite, NewUniversite } from '../universite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUniversite for edit and NewUniversiteFormGroupInput for create.
 */
type UniversiteFormGroupInput = IUniversite | PartialWithRequiredKeyOf<NewUniversite>;

type UniversiteFormDefaults = Pick<NewUniversite, 'id'>;

type UniversiteFormGroupContent = {
  id: FormControl<IUniversite['id'] | NewUniversite['id']>;
  libelle: FormControl<IUniversite['libelle']>;
};

export type UniversiteFormGroup = FormGroup<UniversiteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UniversiteFormService {
  createUniversiteFormGroup(universite: UniversiteFormGroupInput = { id: null }): UniversiteFormGroup {
    const universiteRawValue = {
      ...this.getFormDefaults(),
      ...universite,
    };
    return new FormGroup<UniversiteFormGroupContent>({
      id: new FormControl(
        { value: universiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelle: new FormControl(universiteRawValue.libelle),
    });
  }

  getUniversite(form: UniversiteFormGroup): IUniversite | NewUniversite {
    return form.getRawValue() as IUniversite | NewUniversite;
  }

  resetForm(form: UniversiteFormGroup, universite: UniversiteFormGroupInput): void {
    const universiteRawValue = { ...this.getFormDefaults(), ...universite };
    form.reset(
      {
        ...universiteRawValue,
        id: { value: universiteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UniversiteFormDefaults {
    return {
      id: null,
    };
  }
}
