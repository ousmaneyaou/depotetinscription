import dayjs from 'dayjs/esm';

import { IInscription, NewInscription } from './inscription.model';

export const sampleWithRequiredData: IInscription = {
  id: 45715,
};

export const sampleWithPartialData: IInscription = {
  id: 70873,
  dateInscription: dayjs('2023-08-13'),
  regime: true,
};

export const sampleWithFullData: IInscription = {
  id: 53761,
  dateInscription: dayjs('2023-08-13'),
  regime: true,
};

export const sampleWithNewData: NewInscription = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
