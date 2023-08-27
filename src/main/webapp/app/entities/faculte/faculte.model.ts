import { IUniversite } from 'app/entities/universite/universite.model';

export interface IFaculte {
  id: number;
  libelle?: string | null;
  universite?: Pick<IUniversite, 'id'> | null;
}

export type NewFaculte = Omit<IFaculte, 'id'> & { id: null };
