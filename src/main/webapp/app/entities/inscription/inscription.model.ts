import dayjs from 'dayjs/esm';
import { IDepot } from 'app/entities/depot/depot.model';
import { IAdministration } from 'app/entities/administration/administration.model';

export interface IInscription {
  id: number;
  dateInscription?: dayjs.Dayjs | null;
  regime?: boolean | null;
  depots?: Pick<IDepot, 'id'>[] | null;
  administration?: Pick<IAdministration, 'id'> | null;
}

export type NewInscription = Omit<IInscription, 'id'> & { id: null };
