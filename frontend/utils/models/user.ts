import { HttpStringified } from "../types/http";
import { Notification } from "./repo";

const Departments = {
  TC: "TC",
  IF: "IF",
  GE: "GE",
  GM: "GM",
  GI: "GI",
  GCU: "GCU",
  GEN: "GEN",
  SGM: "SGM",
  BS: "BS",
  FIMI: "FIMI",
  AUTRE: "AUTRE",
};

type Department = keyof typeof Departments;

const Years = {
  A1: "A1",
  A2: "A2",
  A3: "A3",
  A4: "A4",
  A5: "A5",
  VIEUX: "VIEUX",
  AUTRE: "AUTRE",
};

type Year = keyof typeof Years;

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
  has_payed_contributions: boolean;
  pp?: string;
  charisma: number;
}

export interface CompleteUser extends User {
  nickname?: string;
  email: string;
  birthdate: Date;
  phone: string;
  department?: Department;
  comment?: string;
  has_payed_contributions: boolean;
  year?: Year;
  pp?: string;
  charisma: number;
  balance: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  team: string[];
  permissions: string[];

  // This is not in the API response, but is used in the frontend
  notifications: Notification[];
}

export interface CompleteUserWithoutId extends Omit<CompleteUser, "id"> {}

export interface CompleteUserWithPermissions extends CompleteUser {
  permissions: string[];
}

export function castToUserModification(
  user: CompleteUserWithoutId
): UserModification {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    nickname: user.nickname || undefined,
    email: user.email,
    birthdate: new Date(user.birthdate),
    phone: user.phone,
    department: user.department,
    year: user.year || undefined,
    comment: user.comment || undefined,
    has_payed_contributions: user.has_payed_contributions || false,
    pp: user.pp || undefined,
    charisma: +user.charisma,
  };
}

export function castUserWithDate(user: HttpStringified<CompleteUser>) {
  return {
    ...user,
    birthdate: new Date(user.birthdate),
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
  };
}

export function castUsersWithDate(users: HttpStringified<CompleteUser[]>) {
  return users.map(castUserWithDate);
}

export function castUserWithPermissionsWithDate(
  user: HttpStringified<CompleteUserWithPermissions>
) {
  return {
    ...user,
    birthdate: new Date(user.birthdate),
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
  };
}

export function castUsersWithPermissionsWithDate(
  users: HttpStringified<CompleteUserWithPermissions[]>
) {
  return users.map(castUserWithPermissionsWithDate);
}
