import { INiveau, NewNiveau } from './niveau.model';

export const sampleWithRequiredData: INiveau = {
  id: 19826,
};

export const sampleWithPartialData: INiveau = {
  id: 51983,
  libelle: 'interface Applications',
};

export const sampleWithFullData: INiveau = {
  id: 76821,
  libelle: 'transmitting',
};

export const sampleWithNewData: NewNiveau = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
