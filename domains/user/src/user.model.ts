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
  teams: string[];
}

export interface MyUserInformation extends UserPersonnalData {
  balance: number;
  permissions: Permission[];
  tasksCount: number;
}
