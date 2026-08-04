import { IProvidePeriod } from "@overbookd/time";
import { UserWithTeams } from "@overbookd/user";
import { FulfilledRegistration } from "@overbookd/registration";

export type StaffCandidate = UserWithTeams & {
  email: string;
  candidatedAt: Date;
};

export type VolunteerCandidate = StaffCandidate & {
  charisma: number;
  mobilePhone: string;
  availabilities: IProvidePeriod[];
  comment?: string;
  birthDate: Date;
  note?: string;
};

export type HasApplication = { hasApplication: boolean };

export const registrationSteps = {
  LOGIN: "LOGIN",
  FORM: "FORM",
} as const;

export type RegistrationStepKey =
  (typeof registrationSteps)[keyof typeof registrationSteps];

export type RegistrationFormStepUser = Pick<
  FulfilledRegistration,
  | "firstName"
  | "lastName"
  | "nickname"
  | "birthDate"
  | "mobilePhone"
  | "teams"
  | "email"
  | "comment"
>;

export type RegistrationFormStep = {
  next: typeof registrationSteps.FORM;
  user?: Partial<RegistrationFormStepUser>;
};

export type RegistrationLoginStep = {
  next: typeof registrationSteps.LOGIN;
};

export type RegistrationStep = RegistrationFormStep | RegistrationLoginStep;
