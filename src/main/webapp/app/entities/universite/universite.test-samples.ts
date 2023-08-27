import { IUniversite, NewUniversite } from './universite.model';

export const sampleWithRequiredData: IUniversite = {
  id: 96621,
};

export const sampleWithPartialData: IUniversite = {
  id: 55820,
};

export const sampleWithFullData: IUniversite = {
  id: 1924,
  libelle: 'Rica',
};

export const sampleWithNewData: NewUniversite = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
