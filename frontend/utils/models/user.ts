import { HttpStringified } from "../types/http";
import { FTStatus } from "./ft";
import { TaskCategory } from "./ftTimeSpan";
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
  nickname?: string;
}

export interface User extends DisplayedUser {
  id: number;
}

export interface UserWithPermissions extends User {
  permissions: string[];
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
  hasPayedContributions: boolean;
  profilePicture?: string;
  charisma: number;
}

export interface CompleteUser extends User {
  nickname?: string;
  email: string;
  birthdate: Date;
  phone: string;
  department?: Department;
  comment?: string;
  hasPayedContributions: boolean;
  year?: Year;
  profilePicture?: string;
  charisma: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  team: string[];

  // This is not in the API response, but is used in the frontend
  notifications: Notification[];
}

export interface CompleteUserWithoutId extends Omit<CompleteUser, "id"> {}

export interface CompleteUserWithPermissions extends CompleteUser {
  permissions: string[];
}

export interface MyUserInformation extends CompleteUserWithPermissions {
  tasksCount: number;
}

interface Period {
  start: Date;
  end: Date;
}

export interface Task {
  id: number;
  name: string;
  status: FTStatus;
}

export interface VolunteerTask extends Period {
  ft: Task;
  timeSpanId?: number;
}

export interface VolunteerAssignmentStat {
  category: TaskCategory;
  duration: number;
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
    hasPayedContributions: user.hasPayedContributions || false,
    profilePicture: user.profilePicture || undefined,
    charisma: +user.charisma,
  };
}

export function castUserWithDate(
  user: HttpStringified<CompleteUser | MyUserInformation>
) {
  return {
    ...user,
    birthdate: new Date(user.birthdate),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
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
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
}

export function castUsersWithPermissionsWithDate(
  users: HttpStringified<CompleteUserWithPermissions[]>
) {
  return users.map(castUserWithPermissionsWithDate);
}

export function castVolunteerTaskWithDate(
  periods: HttpStringified<VolunteerTask[]>
): VolunteerTask[] {
  return periods.map((task) => ({
    ...task,
    start: new Date(task.start),
    end: new Date(task.end),
  }));
}
