import dayjs from 'dayjs/esm';

import { EnumSexe } from 'app/entities/enumerations/enum-sexe.model';

import { IBachelier, NewBachelier } from './bachelier.model';

export const sampleWithRequiredData: IBachelier = {
  id: 93464,
};

export const sampleWithPartialData: IBachelier = {
  id: 12807,
  sexe: EnumSexe['MASCULIN'],
  dateNaissance: dayjs('2023-08-13'),
  lieuNaissance: 'viral haptic invoice',
  nationalite: 'Wooden methodologies disintermediate',
  numeroTable: 'system-worthy',
  serie: 'Dollar',
  anneeObtention: 'Car Shoes Tactics',
  lieuObtention: 'Ergonomic',
  mention: 'Montenegro Forward Idaho',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
};

export const sampleWithFullData: IBachelier = {
  id: 71164,
  sexe: EnumSexe['FEMININ'],
  dateNaissance: dayjs('2023-08-13'),
  lieuNaissance: 'National Rubber virtual',
  nationalite: 'payment Plastic reboot',
  telephone: '1-387-720-0760',
  numeroTable: 'Shoes',
  serie: 'Credit',
  diplome: 'cultivate',
  numeroTelephone1: 'Rustic Balanced',
  anneeObtention: 'Shoes',
  lieuObtention: 'content-based Kingdom',
  mention: 'frictionless override Pants',
  choix1: 'Supervisor Loop',
  choix2: 'Account Fresh AGP',
  choix3: 'state',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
};

export const sampleWithNewData: NewBachelier = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
