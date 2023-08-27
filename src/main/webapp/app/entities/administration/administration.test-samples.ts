import { IAdministration, NewAdministration } from './administration.model';

export const sampleWithRequiredData: IAdministration = {
  id: 99320,
};

export const sampleWithPartialData: IAdministration = {
  id: 1239,
};

export const sampleWithFullData: IAdministration = {
  id: 67259,
};

export const sampleWithNewData: NewAdministration = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
