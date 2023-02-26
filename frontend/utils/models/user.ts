export interface User {
  id: number;
  firstname: string;
  lastname: string;
}

export interface Friend extends User {
  nickname?: string;
}

export type DisplayedUser = Pick<User, "firstname" | "lastname">;

export interface UserCreation extends Omit<User, "id"> {
  nickname?: string;
  email: string;
  birthdate: Date;
  phone: string;
  teamId?: number;
  department?: string;
  year?: string;
  password: string;
  comment?: string;
}
