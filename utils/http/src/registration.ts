import { IProvidePeriod } from "@overbookd/time";
import { UserWithTeams } from "@overbookd/user";
import {
  FulfilledRegistration,
  PasswordRequirement,
} from "@overbookd/registration";
import { HttpStringified } from "./http-stringified";

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
  COMPLETED: "COMPLETED",
} as const;

export type RegistrationStepKey =
  (typeof registrationSteps)[keyof typeof registrationSteps];

export type RegistrationFormStepUser = Partial<
  Pick<
    FulfilledRegistration,
    | "firstName"
    | "lastName"
    | "nickname"
    | "birthDate"
    | "mobilePhone"
    | "teams"
    | "email"
    | "comment"
  >
>;

export type RegistrationFormStep = {
  next: typeof registrationSteps.FORM;
  user?: RegistrationFormStepUser;
  passwordRequirement: PasswordRequirement;
};

export type RegistrationLoginStep = {
  next: typeof registrationSteps.LOGIN;
};

export type RegistrationCompletedStep = {
  next: typeof registrationSteps.COMPLETED;
};

export type RegistrationStep =
  RegistrationFormStep | RegistrationLoginStep | RegistrationCompletedStep;

export const isRegistrationFormStep = (
  step: RegistrationStep | HttpStringified<RegistrationStep>,
): step is RegistrationFormStep | HttpStringified<RegistrationFormStep> => {
  return step.next === registrationSteps.FORM;
};

export const isRegistrationLoginStep = (
  step: RegistrationStep | HttpStringified<RegistrationStep>,
): step is RegistrationLoginStep | HttpStringified<RegistrationLoginStep> => {
  return step.next === registrationSteps.LOGIN;
};

export const isRegistrationCompletedStep = (
  step: RegistrationStep | HttpStringified<RegistrationStep>,
): step is
  RegistrationCompletedStep | HttpStringified<RegistrationCompletedStep> => {
  return step.next === registrationSteps.COMPLETED;
};
