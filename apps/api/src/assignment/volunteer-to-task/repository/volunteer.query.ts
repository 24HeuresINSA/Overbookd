import { IProvidePeriod } from "@overbookd/time";
import {
  DatabaseFriendCount,
  SELECT_USER_FRIENDS_FOR_COUNT,
} from "../../common/repository/friend.query";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import {
  SELECT_USER_ASSIGNMENT_PREFERENCE,
  SELECT_USER_IDENTIFIER,
  SELECT_USER_WITH_TEAM_CODES,
} from "../../../common/query/user.query";
import {
  SELECT_USER_DATA_FOR_CHARISMA,
  UserDataForCharisma,
} from "../../../common/query/charisma.query";
import { User } from "@overbookd/user";
import { AssignmentPreferenceType } from "@overbookd/preference";
import { IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER } from "../../../user/user.query";

const SELECT_VOLUNTEER = {
  ...SELECT_USER_WITH_TEAM_CODES,
  ...SELECT_USER_ASSIGNMENT_PREFERENCE,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  comment: true,
  note: true,
};

const SELECT_ASSIGNMENTS = {
  assigned: { select: { assignment: { select: SELECT_PERIOD } } },
};

export const SELECT_VOLUNTEER_WITH_ASSIGNMENTS = {
  ...SELECT_VOLUNTEER,
  ...SELECT_ASSIGNMENTS,
  ...SELECT_USER_FRIENDS_FOR_COUNT,
};

export type DatabaseAssigneeWithAssignments = User &
  UserDataForCharisma &
  DatabaseFriendCount & {
    comment?: string;
    note?: string;
    teams: { teamCode: string }[];
    preference: { assignment: AssignmentPreferenceType };
    assigned: { assignment: IProvidePeriod }[];
  };

export const SELECT_VOLUNTEER_ASSIGNMENT_FRIENDS = {
  friends: {
    select: {
      requestor: {
        select: { id: true, ...SELECT_USER_IDENTIFIER },
      },
    },
    where: {
      requestor: IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
    },
  },
  friendRequestors: {
    select: {
      friend: { select: { id: true, ...SELECT_USER_IDENTIFIER } },
    },
    where: {
      friend: IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
    },
  },
};
