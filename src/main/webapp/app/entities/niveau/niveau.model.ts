import { IDepartement } from 'app/entities/departement/departement.model';
import { IDossier } from 'app/entities/dossier/dossier.model';

export interface INiveau {
  id: number;
  libelle?: string | null;
  departement?: Pick<IDepartement, 'id'> | null;
  dossier?: Pick<IDossier, 'id'> | null;
}

export type NewNiveau = Omit<INiveau, 'id'> & { id: null };
