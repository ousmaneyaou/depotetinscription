import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInscription, NewInscription } from '../inscription.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInscription for edit and NewInscriptionFormGroupInput for create.
 */
type InscriptionFormGroupInput = IInscription | PartialWithRequiredKeyOf<NewInscription>;

type InscriptionFormDefaults = Pick<NewInscription, 'id' | 'regime' | 'depots'>;

type InscriptionFormGroupContent = {
  id: FormControl<IInscription['id'] | NewInscription['id']>;
  dateInscription: FormControl<IInscription['dateInscription']>;
  regime: FormControl<IInscription['regime']>;
  depots: FormControl<IInscription['depots']>;
  administration: FormControl<IInscription['administration']>;
};

export type InscriptionFormGroup = FormGroup<InscriptionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InscriptionFormService {
  createInscriptionFormGroup(inscription: InscriptionFormGroupInput = { id: null }): InscriptionFormGroup {
    const inscriptionRawValue = {
      ...this.getFormDefaults(),
      ...inscription,
    };
    return new FormGroup<InscriptionFormGroupContent>({
      id: new FormControl(
        { value: inscriptionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateInscription: new FormControl(inscriptionRawValue.dateInscription),
      regime: new FormControl(inscriptionRawValue.regime),
      depots: new FormControl(inscriptionRawValue.depots ?? []),
      administration: new FormControl(inscriptionRawValue.administration),
    });
  }

  getInscription(form: InscriptionFormGroup): IInscription | NewInscription {
    return form.getRawValue() as IInscription | NewInscription;
  }

  resetForm(form: InscriptionFormGroup, inscription: InscriptionFormGroupInput): void {
    const inscriptionRawValue = { ...this.getFormDefaults(), ...inscription };
    form.reset(
      {
        ...inscriptionRawValue,
        id: { value: inscriptionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InscriptionFormDefaults {
    return {
      id: null,
      regime: false,
      depots: [],
    };
  }
}
