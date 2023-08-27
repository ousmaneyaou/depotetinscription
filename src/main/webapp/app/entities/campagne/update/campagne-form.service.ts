import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICampagne, NewCampagne } from '../campagne.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICampagne for edit and NewCampagneFormGroupInput for create.
 */
type CampagneFormGroupInput = ICampagne | PartialWithRequiredKeyOf<NewCampagne>;

type CampagneFormDefaults = Pick<NewCampagne, 'id'>;

type CampagneFormGroupContent = {
  id: FormControl<ICampagne['id'] | NewCampagne['id']>;
  intitule: FormControl<ICampagne['intitule']>;
  dateDebut: FormControl<ICampagne['dateDebut']>;
  dateFin: FormControl<ICampagne['dateFin']>;
  dossier: FormControl<ICampagne['dossier']>;
};

export type CampagneFormGroup = FormGroup<CampagneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CampagneFormService {
  createCampagneFormGroup(campagne: CampagneFormGroupInput = { id: null }): CampagneFormGroup {
    const campagneRawValue = {
      ...this.getFormDefaults(),
      ...campagne,
    };
    return new FormGroup<CampagneFormGroupContent>({
      id: new FormControl(
        { value: campagneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      intitule: new FormControl(campagneRawValue.intitule),
      dateDebut: new FormControl(campagneRawValue.dateDebut),
      dateFin: new FormControl(campagneRawValue.dateFin),
      dossier: new FormControl(campagneRawValue.dossier),
    });
  }

  getCampagne(form: CampagneFormGroup): ICampagne | NewCampagne {
    return form.getRawValue() as ICampagne | NewCampagne;
  }

  resetForm(form: CampagneFormGroup, campagne: CampagneFormGroupInput): void {
    const campagneRawValue = { ...this.getFormDefaults(), ...campagne };
    form.reset(
      {
        ...campagneRawValue,
        id: { value: campagneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CampagneFormDefaults {
    return {
      id: null,
    };
  }
}
