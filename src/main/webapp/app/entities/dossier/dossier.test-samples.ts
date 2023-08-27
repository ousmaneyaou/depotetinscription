import { IDossier, NewDossier } from './dossier.model';

export const sampleWithRequiredData: IDossier = {
  id: 33437,
};

export const sampleWithPartialData: IDossier = {
  id: 30006,
};

export const sampleWithFullData: IDossier = {
  id: 6477,
  valider: false,
};

export const sampleWithNewData: NewDossier = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
