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

export type RegistrationFormStepWithoutData = {
  next: typeof registrationSteps.FORM;
};

export type RegistrationFormStepWithData = RegistrationFormStepWithoutData & {
  user?: RegistrationFormStepUser;
  passwordRequirement: PasswordRequirement;
};

export type RegistrationFormStep =
  RegistrationFormStepWithoutData | RegistrationFormStepWithData;

export type RegistrationLoginStep = {
  next: typeof registrationSteps.LOGIN;
};

export type RegistrationCompletedStep = {
  next: typeof registrationSteps.COMPLETED;
};

export type RegistrationStep =
  RegistrationFormStep | RegistrationLoginStep | RegistrationCompletedStep;

export const hasRegistrationFormData = (
  step: RegistrationStep | HttpStringified<RegistrationStep>,
): step is
  | RegistrationFormStepWithData
  | HttpStringified<RegistrationFormStepWithData> => {
  return step.next === registrationSteps.FORM && "passwordRequirement" in step;
};
