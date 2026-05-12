import { IProvidePeriod } from "@overbookd/time";
import {
  SELECT_USER_ASSIGNMENT_PREFERENCE,
  SELECT_USER_WITH_TEAM_CODES,
} from "../../../common/query/user.query";
import {
  SELECT_USER_DATA_FOR_CHARISMA,
  UserDataForCharisma,
} from "../../../common/query/charisma.query";
import { User } from "@overbookd/user";
import { AssignmentPreferenceType } from "@overbookd/preference";
import { DatabaseAssignmentWithTaskCategory } from "../../common/repository/assignment-stats.query";

export type DatabaseFriend = {
  id: number;
  assigned: {
    assignment: IProvidePeriod & {
      festivalTaskId: number;
      mobilizationId: string;
      id: string;
    };
  }[];
};

export type DatabaseStoredAssignableVolunteer = User &
  UserDataForCharisma & {
    comment: string;
    note: string;
    teams: { teamCode: string }[];
    assigned: { assignment: DatabaseAssignmentWithTaskCategory }[];
    preference?: { assignment: AssignmentPreferenceType };
    festivalTaskMobilizations: { mobilization: IProvidePeriod }[];
    friends: { requestor: DatabaseFriend }[];
    friendRequestors: { friend: DatabaseFriend }[];
  };

export const SELECT_VOLUNTEER = {
  ...SELECT_USER_ASSIGNMENT_PREFERENCE,
  ...SELECT_USER_WITH_TEAM_CODES,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  comment: true,
  note: true,
};
