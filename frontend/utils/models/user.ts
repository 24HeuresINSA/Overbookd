export interface DisplayedUser {
  firstname: string;
  lastname: string;
}

export interface User extends DisplayedUser {
  id: number;
}

export interface UserWithPermissions extends User {
  permissions: string[];
}

export interface Friend extends User {
  nickname?: string;
}

export interface UserCreation extends DisplayedUser {
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
  charisma?: number;
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
    charisma: +user.charisma,
  };
}
