import { IFaculte, NewFaculte } from './faculte.model';

export const sampleWithRequiredData: IFaculte = {
  id: 45871,
};

export const sampleWithPartialData: IFaculte = {
  id: 35037,
  libelle: 'Towels invoice haptic',
};

export const sampleWithFullData: IFaculte = {
  id: 11261,
  libelle: 'payment Data composite',
};

export const sampleWithNewData: NewFaculte = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
