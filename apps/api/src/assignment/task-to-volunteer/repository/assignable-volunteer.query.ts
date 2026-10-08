import { IProvidePeriod } from "@overbookd/time";
import { UserDataForCharisma } from "../../../common/query/charisma.query";
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
    birthDate: Date;
    assigned: { assignment: DatabaseAssignmentWithTaskCategory }[];
    preference?: { assignment: AssignmentPreferenceType };
    festivalTaskMobilizations: { mobilization: IProvidePeriod }[];
    friends: { requestor: DatabaseFriend }[];
    friendRequestors: { friend: DatabaseFriend }[];
  };
