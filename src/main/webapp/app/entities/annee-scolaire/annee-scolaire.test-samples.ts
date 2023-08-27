import { IAnneeScolaire, NewAnneeScolaire } from './annee-scolaire.model';

export const sampleWithRequiredData: IAnneeScolaire = {
  id: 40639,
};

export const sampleWithPartialData: IAnneeScolaire = {
  id: 99758,
};

export const sampleWithFullData: IAnneeScolaire = {
  id: 76422,
  libelle: 'Jewelery e-business',
  enCours: false,
};

export const sampleWithNewData: NewAnneeScolaire = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
