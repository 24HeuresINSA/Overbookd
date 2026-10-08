import { IProvidePeriod } from "@overbookd/time";
import { DatabaseAssignmentWithTaskCategory } from "../../common/repository/assignment-stats.query";
import { DatabaseVolunteer } from "../../common/repository/volunteer.query";

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

export type DatabaseStoredAssignableVolunteer = DatabaseVolunteer & {
  assigned: { assignment: DatabaseAssignmentWithTaskCategory }[];
  festivalTaskMobilizations: { mobilization: IProvidePeriod }[];
  friends: { requestor: DatabaseFriend }[];
  friendRequestors: { friend: DatabaseFriend }[];
};
