import { MyUserInformation, UserPersonnalData } from "@overbookd/user";
import { TeamWithNestedPermissions } from "../team/utils/permissions";
import { IProvidePeriod } from "@overbookd/period";
import { Ft } from "@prisma/client"; // TODO do not use prisma type

export type UserPasswordOnly = {
  password: string;
};

export interface DatabaseMyUserInformation
  extends Omit<MyUserInformation, "teams" | "permissions" | "tasksCount"> {
  teams: TeamWithNestedPermissions[];
  _count: { assignments: number };
}

export interface VolunteerTask extends IProvidePeriod {
  ft: Pick<Ft, "id" | "name" | "status">;
  timeSpanId?: number;
}

export type DatabaseTeamCode = {
  team: {
    code: string;
  };
};

export interface DatabaseUserPersonalData
  extends Omit<UserPersonnalData, "teams"> {
  teams: DatabaseTeamCode[];
}
