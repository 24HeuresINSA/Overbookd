import { IProvidePeriod } from "@overbookd/period";
import {
  COUNT_FRIENDS,
  DatabaseFriendCount,
} from "../../common/repository/friend.query";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import {
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../../../common/query/user.query";
import {
  SELECT_USER_DATA_FOR_CHARISMA,
  UserDataForCharisma,
} from "../../../common/query/charisma.query";
import { User } from "@overbookd/user";

const SELECT_VOLUNTEER = {
  ...SELECT_USER_IDENTIFIER,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  ...SELECT_TEAMS_CODE,
  comment: true,
  note: true,
};

const SELECT_ASSIGNMENTS = {
  assigned: { select: { assignment: { select: SELECT_PERIOD } } },
};

export const SELECT_VOLUNTEER_WITH_ASSIGNMENTS = {
  ...SELECT_VOLUNTEER,
  ...SELECT_ASSIGNMENTS,
  ...COUNT_FRIENDS,
};

export type DatabaseAssigneeWithAssignments = User &
  UserDataForCharisma &
  DatabaseFriendCount & {
    comment?: string;
    note?: string;
    teams: { teamCode: string }[];
    assigned: { assignment: IProvidePeriod }[];
  };
