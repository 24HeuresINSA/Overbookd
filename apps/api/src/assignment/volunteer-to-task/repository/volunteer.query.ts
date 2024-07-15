import { IProvidePeriod } from "@overbookd/period";
import { BENEVOLE_CODE } from "@overbookd/team-constants";
import {
  COUNT_FRIENDS,
  DatabaseFriendCount,
} from "../../common/repository/friend.query";
import { SELECT_PERIOD } from "../../../common/query/period.query";

export const IS_MEMBER_OF_VOLUNTEER_TEAM = {
  teams: {
    some: {
      team: { code: BENEVOLE_CODE },
    },
  },
};

const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  charisma: true,
  comment: true,
  note: true,
  teams: {
    select: {
      team: { select: { code: true } },
    },
  },
};

const SELECT_ASSIGNMENTS = {
  assigned: {
    select: {
      assignment: { select: SELECT_PERIOD },
    },
  },
};

export const SELECT_VOLUNTEER_WITH_ASSIGNMENTS = {
  ...SELECT_VOLUNTEER,
  ...SELECT_ASSIGNMENTS,
  ...COUNT_FRIENDS,
};

export type DatabaseAssigneeWithAssignments = DatabaseFriendCount & {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  charisma: number;
  comment?: string;
  note?: string;
  teams: { team: { code: string } }[];
  assigned: { assignment: IProvidePeriod }[];
};
