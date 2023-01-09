export interface User {
  id: number;
  firstname: string;
  lastname: string;
}

export type DisplayedUser = Pick<User, "firstname" | "lastname">;
