import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAdministration, NewAdministration } from '../administration.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAdministration for edit and NewAdministrationFormGroupInput for create.
 */
type AdministrationFormGroupInput = IAdministration | PartialWithRequiredKeyOf<NewAdministration>;

type AdministrationFormDefaults = Pick<NewAdministration, 'id'>;

type AdministrationFormGroupContent = {
  id: FormControl<IAdministration['id'] | NewAdministration['id']>;
  user: FormControl<IAdministration['user']>;
};

export type AdministrationFormGroup = FormGroup<AdministrationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AdministrationFormService {
  createAdministrationFormGroup(administration: AdministrationFormGroupInput = { id: null }): AdministrationFormGroup {
    const administrationRawValue = {
      ...this.getFormDefaults(),
      ...administration,
    };
    return new FormGroup<AdministrationFormGroupContent>({
      id: new FormControl(
        { value: administrationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user: new FormControl(administrationRawValue.user),
    });
  }

  getAdministration(form: AdministrationFormGroup): IAdministration | NewAdministration {
    return form.getRawValue() as IAdministration | NewAdministration;
  }

  resetForm(form: AdministrationFormGroup, administration: AdministrationFormGroupInput): void {
    const administrationRawValue = { ...this.getFormDefaults(), ...administration };
    form.reset(
      {
        ...administrationRawValue,
        id: { value: administrationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AdministrationFormDefaults {
    return {
      id: null,
    };
  }
}
