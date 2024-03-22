import { FestivalTask } from "@overbookd/festival-event";
import { HttpStringified, PlanningTask } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { MyUserInformation, UserPersonalData } from "@overbookd/user";
import { TaskCategory } from "./ft-time-span.model";

type WithPotentialProfilePicture = {
  profilePicture?: string;
  profilePictureBlob?: string;
};

export type UserPersonalDataWithProfilePicture = UserPersonalData &
  WithPotentialProfilePicture;

export type MyUserInformationWithProfilePicture = MyUserInformation &
  WithPotentialProfilePicture;

export type Task = {
  id: number;
  name: string;
  status: FestivalTask["status"];
};

export type VolunteerTask = IProvidePeriod & {
  ft: Task;
  timeSpanId?: number;
};

export type VolunteerAssignmentStat = {
  category: TaskCategory;
  duration: number;
};

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

export function castVolunteerPlanningTasksWithDate(
  tasks: HttpStringified<PlanningTask[]>,
): PlanningTask[] {
  return tasks.map(({ timeWindow, ...task }) => ({
    ...task,
    timeWindow: {
      ...timeWindow,
      start: new Date(timeWindow.start),
      end: new Date(timeWindow.end),
    },
  }));
}

export type Consumer = UserPersonalData & { balance: number };
