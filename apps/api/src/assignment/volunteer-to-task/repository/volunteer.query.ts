import { IProvidePeriod } from "@overbookd/time";
import {
  DatabaseFriendCount,
  SELECT_USER_FRIENDS_FOR_COUNT,
} from "../../common/repository/friend.query";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { SELECT_USER_IDENTIFIER } from "../../../common/query/user.query";
import { IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER } from "../../../user/user.query";
import {
  DatabaseVolunteer,
  SELECT_VOLUNTEER,
} from "../../common/repository/volunteer.query";

const SELECT_ASSIGNMENTS = {
  assigned: { select: { assignment: { select: SELECT_PERIOD } } },
};

export const SELECT_VOLUNTEER_WITH_ASSIGNMENTS = {
  ...SELECT_VOLUNTEER,
  ...SELECT_ASSIGNMENTS,
  ...SELECT_USER_FRIENDS_FOR_COUNT,
};

export type DatabaseAssigneeWithAssignments = DatabaseVolunteer &
  DatabaseFriendCount & {
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
