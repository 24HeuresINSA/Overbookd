import { Permission } from "@overbookd/permission";
import { Membership } from "@overbookd/registration";

export type UserName = {
  firstname: string;
  lastname: string;
  nickname?: string | null;
};

export type User = UserName & {
  id: number;
};

export type Profile = UserName & {
  email: string;
  birthdate: Date;
  phone: string;
  comment: string | null;
};

export type UserPersonalData = User & {
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string | null;
  charisma: number;
  teams: string[];
  note?: string | null;
  preference?: {
    assignment: string;
  };
};

export type MyUserInformation = UserPersonalData & {
  balance: number;
  permissions: Permission[];
  tasksCount: number;
  hasApprovedEULA: boolean;
  membershipApplication: Membership | null;
};
