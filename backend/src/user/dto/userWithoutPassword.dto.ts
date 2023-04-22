import { Department, Year } from '.prisma/client';
import { UserWithoutPassword } from '../user.model';

export class UserWithoutPasswordDto implements UserWithoutPassword {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string | null;
  email: string;
  birthdate: Date;
  phone: string;
  department: Department | null;
  comment: string | null;
  reset_password_token: string | null;
  reset_password_expires: Date | null;
  has_payed_contributions: boolean;
  year: Year | null;
  profilePicture: string | null;
  charisma: number;
  balance: number;
  password: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
