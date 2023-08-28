import dayjs from 'dayjs/esm';
import { IDepot } from 'app/entities/depot/depot.model';

export interface IInscription {
  id: number;
  dateInscription?: dayjs.Dayjs | null;
  regime?: boolean | null;
  depots?: Pick<IDepot, 'id'>[] | null;
}

export type NewInscription = Omit<IInscription, 'id'> & { id: null };
