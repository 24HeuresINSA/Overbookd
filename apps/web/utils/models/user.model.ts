import { FestivalTask } from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import {
  MyUserInformation,
  UserPersonalData,
  UserUpdateForm,
} from "@overbookd/user";
import { TaskCategory } from "./ft-time-span.model";

type WithPotentialProfilePicture = {
  profilePicture?: string;
  profilePictureBlob?: string;
};

export type UserPersonalDataWithProfilePicture = UserPersonalData &
  WithPotentialProfilePicture;

export type MyUserInformationWithProfilePicture = MyUserInformation &
  WithPotentialProfilePicture;

export interface Task {
  id: number;
  name: string;
  status: FestivalTask["status"];
}

export interface VolunteerTask extends IProvidePeriod {
  ft: Task;
  timeSpanId?: number;
}

export interface VolunteerAssignmentStat {
  category: TaskCategory;
  duration: number;
}

export function castToUserUpdateForm(user: UserPersonalData): UserUpdateForm {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    nickname: user.nickname || null,
    email: user.email,
    birthdate: new Date(user.birthdate),
    phone: user.phone,
    comment: user.comment || null,
    charisma: +user.charisma,
  };
}

export function castUserWithDate(
  user: HttpStringified<UserPersonalData | MyUserInformation | Consumer>,
) {
  return {
    ...user,
    birthdate: new Date(user.birthdate),
  };
}

export function castUsersWithDate(users: HttpStringified<UserPersonalData[]>) {
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

export type Consumer = UserPersonalData & { balance: number };
