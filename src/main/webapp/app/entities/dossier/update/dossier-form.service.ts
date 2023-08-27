import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDossier, NewDossier } from '../dossier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDossier for edit and NewDossierFormGroupInput for create.
 */
type DossierFormGroupInput = IDossier | PartialWithRequiredKeyOf<NewDossier>;

type DossierFormDefaults = Pick<NewDossier, 'id' | 'valider' | 'depots'>;

type DossierFormGroupContent = {
  id: FormControl<IDossier['id'] | NewDossier['id']>;
  valider: FormControl<IDossier['valider']>;
  depots: FormControl<IDossier['depots']>;
};

export type DossierFormGroup = FormGroup<DossierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DossierFormService {
  createDossierFormGroup(dossier: DossierFormGroupInput = { id: null }): DossierFormGroup {
    const dossierRawValue = {
      ...this.getFormDefaults(),
      ...dossier,
    };
    return new FormGroup<DossierFormGroupContent>({
      id: new FormControl(
        { value: dossierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      valider: new FormControl(dossierRawValue.valider),
      depots: new FormControl(dossierRawValue.depots ?? []),
    });
  }

  getDossier(form: DossierFormGroup): IDossier | NewDossier {
    return form.getRawValue() as IDossier | NewDossier;
  }

  resetForm(form: DossierFormGroup, dossier: DossierFormGroupInput): void {
    const dossierRawValue = { ...this.getFormDefaults(), ...dossier };
    form.reset(
      {
        ...dossierRawValue,
        id: { value: dossierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DossierFormDefaults {
    return {
      id: null,
      valider: false,
      depots: [],
    };
  }
}
