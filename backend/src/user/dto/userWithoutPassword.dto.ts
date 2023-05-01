import { UserWithoutPassword } from '../user.model';
import { Departments, Years } from './common';

export class UserWithoutPasswordDto implements UserWithoutPassword {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string | null;
  email: string;
  birthdate: Date;
  phone: string;
  department: Departments | null;
  comment: string | null;
  reset_password_token: string | null;
  reset_password_expires: Date | null;
  has_payed_contributions: boolean;
  year: Years | null;
  profilePicture: string | null;
  charisma: number;
  balance: number;
  password: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
