import { UserName } from "./user.model";

export interface UserCreateForm extends UserName {
  teamCode?: string;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  password: string;
}

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
}
