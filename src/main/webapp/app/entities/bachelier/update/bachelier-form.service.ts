import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBachelier, NewBachelier } from '../bachelier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBachelier for edit and NewBachelierFormGroupInput for create.
 */
type BachelierFormGroupInput = IBachelier | PartialWithRequiredKeyOf<NewBachelier>;

type BachelierFormDefaults = Pick<NewBachelier, 'id'>;

type BachelierFormGroupContent = {
  id: FormControl<IBachelier['id'] | NewBachelier['id']>;
  sexe: FormControl<IBachelier['sexe']>;
  dateNaissance: FormControl<IBachelier['dateNaissance']>;
  lieuNaissance: FormControl<IBachelier['lieuNaissance']>;
  nationalite: FormControl<IBachelier['nationalite']>;
  telephone: FormControl<IBachelier['telephone']>;
  numeroTable: FormControl<IBachelier['numeroTable']>;
  serie: FormControl<IBachelier['serie']>;
  diplome: FormControl<IBachelier['diplome']>;
  numeroTelephone1: FormControl<IBachelier['numeroTelephone1']>;
  anneeObtention: FormControl<IBachelier['anneeObtention']>;
  lieuObtention: FormControl<IBachelier['lieuObtention']>;
  mention: FormControl<IBachelier['mention']>;
  choix1: FormControl<IBachelier['choix1']>;
  choix2: FormControl<IBachelier['choix2']>;
  choix3: FormControl<IBachelier['choix3']>;
  photo: FormControl<IBachelier['photo']>;
  photoContentType: FormControl<IBachelier['photoContentType']>;
  user: FormControl<IBachelier['user']>;
};

export type BachelierFormGroup = FormGroup<BachelierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BachelierFormService {
  createBachelierFormGroup(bachelier: BachelierFormGroupInput = { id: null }): BachelierFormGroup {
    const bachelierRawValue = {
      ...this.getFormDefaults(),
      ...bachelier,
    };
    return new FormGroup<BachelierFormGroupContent>({
      id: new FormControl(
        { value: bachelierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sexe: new FormControl(bachelierRawValue.sexe),
      dateNaissance: new FormControl(bachelierRawValue.dateNaissance),
      lieuNaissance: new FormControl(bachelierRawValue.lieuNaissance),
      nationalite: new FormControl(bachelierRawValue.nationalite),
      telephone: new FormControl(bachelierRawValue.telephone),
      numeroTable: new FormControl(bachelierRawValue.numeroTable),
      serie: new FormControl(bachelierRawValue.serie),
      diplome: new FormControl(bachelierRawValue.diplome),
      numeroTelephone1: new FormControl(bachelierRawValue.numeroTelephone1),
      anneeObtention: new FormControl(bachelierRawValue.anneeObtention),
      lieuObtention: new FormControl(bachelierRawValue.lieuObtention),
      mention: new FormControl(bachelierRawValue.mention),
      choix1: new FormControl(bachelierRawValue.choix1),
      choix2: new FormControl(bachelierRawValue.choix2),
      choix3: new FormControl(bachelierRawValue.choix3),
      photo: new FormControl(bachelierRawValue.photo),
      photoContentType: new FormControl(bachelierRawValue.photoContentType),
      user: new FormControl(bachelierRawValue.user),
    });
  }

  getBachelier(form: BachelierFormGroup): IBachelier | NewBachelier {
    return form.getRawValue() as IBachelier | NewBachelier;
  }

  resetForm(form: BachelierFormGroup, bachelier: BachelierFormGroupInput): void {
    const bachelierRawValue = { ...this.getFormDefaults(), ...bachelier };
    form.reset(
      {
        ...bachelierRawValue,
        id: { value: bachelierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BachelierFormDefaults {
    return {
      id: null,
    };
  }
}
