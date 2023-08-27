import { IDepot } from 'app/entities/depot/depot.model';

export interface IDossier {
  id: number;
  valider?: boolean | null;
  depots?: Pick<IDepot, 'id'>[] | null;
}

export type NewDossier = Omit<IDossier, 'id'> & { id: null };
