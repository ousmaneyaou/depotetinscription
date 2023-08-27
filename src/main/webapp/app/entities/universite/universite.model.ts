export interface IUniversite {
  id: number;
  libelle?: string | null;
}

export type NewUniversite = Omit<IUniversite, 'id'> & { id: null };
