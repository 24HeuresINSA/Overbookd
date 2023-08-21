import { IProvidePeriod } from '@overbookd/period';
import { HttpStringified } from '../types/http';
import { FtStatus } from './ft';
import { TaskCategory } from './ftTimeSpan';

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
  extends Omit<UserCreation, 'password' | 'teamId'> {
  hasPayedContributions: boolean;
  profilePicture?: string;
  charisma: number;
}

export interface CompleteUser extends User {
  nickname?: string;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  hasPayedContributions: boolean;
  profilePicture?: string;
  profilePictureBlob?: string;
  charisma: number;
  balance: number;
  teams: string[];
}

export interface CompleteUserWithoutId extends Omit<CompleteUser, 'id'> {}

export interface CompleteUserWithPermissions extends CompleteUser {
  permissions: string[];
}

export interface MyUserInformation extends CompleteUserWithPermissions {
  tasksCount: number;
}

export interface Task {
  id: number;
  name: string;
  status: FtStatus;
}

export interface VolunteerTask extends IProvidePeriod {
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
