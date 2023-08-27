import dayjs from 'dayjs/esm';
import { IDossier } from 'app/entities/dossier/dossier.model';

export interface ICampagne {
  id: number;
  intitule?: string | null;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  dossier?: Pick<IDossier, 'id'> | null;
}

export type NewCampagne = Omit<ICampagne, 'id'> & { id: null };
