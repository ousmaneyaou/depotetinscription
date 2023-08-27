import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { EnumSexe } from 'app/entities/enumerations/enum-sexe.model';

export interface IBachelier {
  id: number;
  sexe?: EnumSexe | null;
  dateNaissance?: dayjs.Dayjs | null;
  lieuNaissance?: string | null;
  nationalite?: string | null;
  telephone?: string | null;
  numeroTable?: string | null;
  serie?: string | null;
  diplome?: string | null;
  numeroTelephone1?: string | null;
  anneeObtention?: string | null;
  lieuObtention?: string | null;
  mention?: string | null;
  choix1?: string | null;
  choix2?: string | null;
  choix3?: string | null;
  photo?: string | null;
  photoContentType?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewBachelier = Omit<IBachelier, 'id'> & { id: null };
