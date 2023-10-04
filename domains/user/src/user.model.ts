import { Permission } from "@overbookd/permission";

export interface UserName {
  firstname: string;
  lastname: string;
  nickname?: string | null;
}

export interface User extends UserName {
  id: number;
}

export type Profile = UserName & {
  email: string;
  birthdate: Date;
  phone: string;
  comment: string | null;
};

export interface UserPersonalData extends User {
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string | null;
  charisma: number;
  teams: string[];
}

export interface MyUserInformation extends UserPersonalData {
  balance: number;
  permissions: Permission[];
  tasksCount: number;
}
