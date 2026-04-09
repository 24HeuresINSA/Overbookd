import { Membership } from "@overbookd/registration";
import { MyUserInformation, UserPersonalData } from "@overbookd/user";
import { UserDataForCharisma } from "../common/query/charisma.query";
import { WithTransactionsForBalance } from "../common/query/transaction.query";
import { TeamWithNestedPermissions } from "../team/utils/permissions";

export type UserPasswordOnly = {
  password: string;
};

export type DatabaseMyUserInformation = Omit<
  MyUserInformation,
  | "teams"
  | "permissions"
  | "tasksCount"
  | "balance"
  | "charisma"
  | "membershipApplication"
> &
  UserDataForCharisma &
  WithTransactionsForBalance & {
    teams: TeamWithNestedPermissions[];
    _count: { assigned: number };
    membershipApplications: { membership: Membership }[];
  };

export type DatabaseTeamCode = {
  team: {
    code: string;
  };
};

export type DatabaseUserPersonalData = Omit<
  UserPersonalData,
  "teams" | "charisma"
> &
  UserDataForCharisma & {
    teams: DatabaseTeamCode[];
  };

type WithBalance = {
  balance: number;
};

export type Consumer = UserPersonalData & WithBalance;

export type DatabaseConsumer = DatabaseUserPersonalData &
  WithTransactionsForBalance;
