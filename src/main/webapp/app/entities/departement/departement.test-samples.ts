import { IDepartement, NewDepartement } from './departement.model';

export const sampleWithRequiredData: IDepartement = {
  id: 86141,
};

export const sampleWithPartialData: IDepartement = {
  id: 48984,
  libelle: 'initiatives',
};

export const sampleWithFullData: IDepartement = {
  id: 66903,
  libelle: 'Account Legacy Hong',
};

export const sampleWithNewData: NewDepartement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
