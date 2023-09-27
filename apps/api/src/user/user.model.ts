import { MyUserInformation, UserPersonnalData } from "@overbookd/user";
import { TeamWithNestedPermissions } from "../team/utils/permissions";
import { IProvidePeriod } from "@overbookd/period";
import { FtStatus } from "../ft/ft.model";

export type UserPasswordOnly = {
  password: string;
};

export interface DatabaseMyUserInformation
  extends Omit<MyUserInformation, "teams" | "permissions" | "tasksCount"> {
  teams: TeamWithNestedPermissions[];
  _count: { assignments: number };
}

export interface VolunteerTask extends IProvidePeriod {
  ft: {
    id: number;
    name: string;
    status: FtStatus;
  };
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

type WithBalance = {
  balance: number;
};

export type Consumer = UserPersonnalData & WithBalance;

export type DatabaseConsumer = DatabaseUserPersonalData & WithBalance;
