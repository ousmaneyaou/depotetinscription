import { IDepot, NewDepot } from './depot.model';

export const sampleWithRequiredData: IDepot = {
  id: 1234,
};

export const sampleWithPartialData: IDepot = {
  id: 20194,
};

export const sampleWithFullData: IDepot = {
  id: 65172,
  dossierValide: false,
};

export const sampleWithNewData: NewDepot = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
