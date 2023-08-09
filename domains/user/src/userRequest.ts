import { UserName } from "./userData";

export interface UserCreateForm extends UserName {
  teamId?: number;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  password: string;
};

export interface UserUpdateForm {
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  birthdate?: Date;
  phone?: string;
  comment?: string;
  hasPayedContributions?: boolean;
  profilePicture?: string;
  charisma?: number;
};