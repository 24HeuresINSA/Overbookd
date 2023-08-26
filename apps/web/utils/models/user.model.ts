import { IProvidePeriod } from "@overbookd/period";
import { HttpStringified } from "../types/http";
import { FtStatus } from "./ft.model";
import { TaskCategory } from "./ft-time-span.model";
import {
  MyUserInformation,
  UserPersonnalData,
  UserUpdateForm,
} from "@overbookd/user";

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

export function castToUserUpdateForm(user: UserPersonnalData): UserUpdateForm {
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
  user: HttpStringified<UserPersonnalData | MyUserInformation>,
) {
  return {
    ...user,
    birthdate: new Date(user.birthdate),
  };
}

export function castUsersWithDate(users: HttpStringified<UserPersonnalData[]>) {
  return users.map(castUserWithDate);
}

export function castVolunteerTaskWithDate(
  periods: HttpStringified<VolunteerTask[]>,
): VolunteerTask[] {
  return periods.map((task) => ({
    ...task,
    start: new Date(task.start),
    end: new Date(task.end),
  }));
}
