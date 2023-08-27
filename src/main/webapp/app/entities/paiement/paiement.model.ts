import dayjs from 'dayjs/esm';
import { IInscription } from 'app/entities/inscription/inscription.model';

export interface IPaiement {
  id: number;
  datePaie?: dayjs.Dayjs | null;
  etat?: boolean | null;
  inscription?: Pick<IInscription, 'id'> | null;
}

export type NewPaiement = Omit<IPaiement, 'id'> & { id: null };
