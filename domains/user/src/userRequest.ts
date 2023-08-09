import { UserName, UserNameWithNickname } from "./userData";

export interface UserCreateForm extends UserNameWithNickname {
  teamId?: number;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  password: string;
};

export interface UserUpdateForm extends UserName {
  nickname?: string | null;
  email?: string;
  birthdate?: Date;
  phone?: string;
  comment?: string | null;
  hasPayedContributions?: boolean;
  profilePicture?: string | null;
  charisma?: number;
};