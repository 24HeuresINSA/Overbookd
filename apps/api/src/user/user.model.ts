import { MyUserInformation, UserPersonalData } from "@overbookd/user";
import { TeamWithNestedPermissions } from "../team/utils/permissions";
import { IProvidePeriod } from "@overbookd/period";
import { FtStatus } from "../ft/ft.model";

export type UserPasswordOnly = {
  password: string;
};

export type DatabaseMyUserInformation = Omit<
  MyUserInformation,
  "teams" | "permissions" | "tasksCount"
> & {
  teams: TeamWithNestedPermissions[];
  _count: { assignments: number };
};

export type VolunteerTask = IProvidePeriod & {
  ft: {
    id: number;
    name: string;
    status: FtStatus;
  };
  timeSpanId?: number;
};

export type DatabaseTeamCode = {
  team: {
    code: string;
  };
};

export type DatabaseUserPersonalData = Omit<UserPersonalData, "teams"> & {
  teams: DatabaseTeamCode[];
};

type WithBalance = {
  balance: number;
};

export type Consumer = UserPersonalData & WithBalance;

export type DatabaseConsumer = DatabaseUserPersonalData & WithBalance;
