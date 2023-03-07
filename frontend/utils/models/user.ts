export interface UserName {
  firstname: string;
  lastname: string;
}

export interface User extends UserName {
  id: number;
}

export interface UserWithPermissions extends User {
  permissions: string[];
}

export interface Friend extends User {
  nickname?: string;
}

export type DisplayedUser = Pick<User, "firstname" | "lastname">;

export interface UserCreation extends UserName {
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

export interface UserModification
  extends Omit<UserCreation, "password" | "teamId"> {
  has_payed_contributions?: boolean;
  pp?: string;
}

export function castToUserModification(user: any): UserModification {
  return {
    firstname: user.firstname || null,
    lastname: user.lastname || null,
    nickname: user.nickname || null,
    email: user.email || null,
    birthdate: user.birthdate,
    phone: user.phone || null,
    department: user.department || null,
    year: user.year || null,
    comment: user.comment || null,
    has_payed_contributions: user.has_payed_contributions || false,
    pp: user.pp || null,
  };
}
