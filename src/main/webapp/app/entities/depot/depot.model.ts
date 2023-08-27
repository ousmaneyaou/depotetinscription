import { IInscription } from 'app/entities/inscription/inscription.model';
import { IDossier } from 'app/entities/dossier/dossier.model';

export interface IDepot {
  id: number;
  dossierValide?: boolean | null;
  inscriptions?: Pick<IInscription, 'id'>[] | null;
  dossiers?: Pick<IDossier, 'id'>[] | null;
}

export type NewDepot = Omit<IDepot, 'id'> & { id: null };
