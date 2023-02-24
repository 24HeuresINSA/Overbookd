export interface User {
  id: number;
  firstname: string;
  lastname: string;
}

export type DisplayedUser = Pick<User, "firstname" | "lastname">;

export interface SoftUserCreation {
  firstname: string;
  lastname: string;
  nickname?: string;
  email: string;
  birthdate: string;
  phone: string;
  password: string;
  comment?: string;
  team?: string;
  department?: string;
  year?: string;
}

