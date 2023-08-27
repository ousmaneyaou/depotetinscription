import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAnneeScolaire, NewAnneeScolaire } from '../annee-scolaire.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnneeScolaire for edit and NewAnneeScolaireFormGroupInput for create.
 */
type AnneeScolaireFormGroupInput = IAnneeScolaire | PartialWithRequiredKeyOf<NewAnneeScolaire>;

type AnneeScolaireFormDefaults = Pick<NewAnneeScolaire, 'id' | 'enCours'>;

type AnneeScolaireFormGroupContent = {
  id: FormControl<IAnneeScolaire['id'] | NewAnneeScolaire['id']>;
  libelle: FormControl<IAnneeScolaire['libelle']>;
  enCours: FormControl<IAnneeScolaire['enCours']>;
  campagne: FormControl<IAnneeScolaire['campagne']>;
};

export type AnneeScolaireFormGroup = FormGroup<AnneeScolaireFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnneeScolaireFormService {
  createAnneeScolaireFormGroup(anneeScolaire: AnneeScolaireFormGroupInput = { id: null }): AnneeScolaireFormGroup {
    const anneeScolaireRawValue = {
      ...this.getFormDefaults(),
      ...anneeScolaire,
    };
    return new FormGroup<AnneeScolaireFormGroupContent>({
      id: new FormControl(
        { value: anneeScolaireRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelle: new FormControl(anneeScolaireRawValue.libelle),
      enCours: new FormControl(anneeScolaireRawValue.enCours),
      campagne: new FormControl(anneeScolaireRawValue.campagne),
    });
  }

  getAnneeScolaire(form: AnneeScolaireFormGroup): IAnneeScolaire | NewAnneeScolaire {
    return form.getRawValue() as IAnneeScolaire | NewAnneeScolaire;
  }

  resetForm(form: AnneeScolaireFormGroup, anneeScolaire: AnneeScolaireFormGroupInput): void {
    const anneeScolaireRawValue = { ...this.getFormDefaults(), ...anneeScolaire };
    form.reset(
      {
        ...anneeScolaireRawValue,
        id: { value: anneeScolaireRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AnneeScolaireFormDefaults {
    return {
      id: null,
      enCours: false,
    };
  }
}
