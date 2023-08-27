import dayjs from 'dayjs/esm';

import { IPaiement, NewPaiement } from './paiement.model';

export const sampleWithRequiredData: IPaiement = {
  id: 69996,
};

export const sampleWithPartialData: IPaiement = {
  id: 34485,
  datePaie: dayjs('2023-08-13'),
  etat: true,
};

export const sampleWithFullData: IPaiement = {
  id: 97812,
  datePaie: dayjs('2023-08-13'),
  etat: true,
};

export const sampleWithNewData: NewPaiement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
