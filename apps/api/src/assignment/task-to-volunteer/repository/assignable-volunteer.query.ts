import { Category, READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";
import { SELECT_PERIOD } from "../../common/period.query";

type DatabaseFriend = {
  availabilities: IProvidePeriod[];
  assigned: {
    assignment: IProvidePeriod & {
      festivalTaskId: number;
    };
  }[];
};

export type DatabaseStoredAssignableVolunteer = {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
  charisma: number;
  comment: string;
  note: string;
  teams: { teamCode: string }[];
  assigned: {
    assignment: IProvidePeriod & { festivalTask: { category: Category } };
  }[];
  festivalTaskMobilizations: { mobilization: IProvidePeriod }[];
  friends: { requestor: DatabaseFriend }[];
  friendRequestors: { friend: DatabaseFriend }[];
};

export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  charisma: true,
  comment: true,
  note: true,
  teams: { select: { teamCode: true } },
};

export const SELECT_VOLUNTEER_MOBILIZATIONS = {
  festivalTaskMobilizations: {
    where: {
      mobilization: {
        ft: { status: { not: READY_TO_ASSIGN } },
      },
    },
    select: {
      mobilization: {
        select: SELECT_PERIOD,
      },
    },
  },
} as const;
