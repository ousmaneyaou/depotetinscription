import { IUser } from 'app/entities/user/user.model';

export interface IAdministration {
  id: number;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewAdministration = Omit<IAdministration, 'id'> & { id: null };
