import { Permission } from "@overbookd/permission";

export interface UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

export interface User extends UserName {
  id: number;
}

export type Profile = UserName & {
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
};

export interface UserPersonnalData extends User {
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  charisma: number;
  balance: number;
  teams: string[];
}

export interface MyUserInformation extends UserPersonnalData {
  permissions: Permission[];
  tasksCount: number;
}
