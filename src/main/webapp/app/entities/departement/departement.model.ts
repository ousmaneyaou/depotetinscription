import { IFaculte } from 'app/entities/faculte/faculte.model';

export interface IDepartement {
  id: number;
  libelle?: string | null;
  faculte?: Pick<IFaculte, 'id'> | null;
}

export type NewDepartement = Omit<IDepartement, 'id'> & { id: null };
