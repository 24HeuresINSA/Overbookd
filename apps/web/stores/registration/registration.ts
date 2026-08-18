import { type Membership, RegisterForm } from "@overbookd/registration";
import type {
  Credentials,
  FulfilledRegistration,
  PasswordRequirement,
} from "@overbookd/registration";
import { isHttpError } from "~/utils/http/http-error.utils";
import { RegistrationRepository } from "~/repositories/registration/registration.repository";
import {
  isRegistrationCompletedStep,
  isRegistrationFormStep,
  type HttpStringified,
  type RegistrationStep,
} from "@overbookd/http";

type State = {
  fullyRegistered: boolean;
  prefilledRegisterForm?: {
    userData?: Partial<FulfilledRegistration>;
    passwordRequirement: PasswordRequirement;
  };
};

export const useRegistrationStore = defineStore("registration", {
  state: (): State => ({
    fullyRegistered: false,
    prefilledRegisterForm: undefined,
  }),
  actions: {
    async register(form: RegisterForm, token?: string): Promise<boolean> {
      const res = await RegistrationRepository.registerNewcomer(form, token);
      this.prefilledRegisterForm = undefined;
      if (isHttpError(res)) return false;
      this.clearRegistrationData();
      sendSuccessNotification("Merci pour ton inscription 🎉");
      return true;
    },

    async checkAuthenticatedUser(): Promise<RegistrationStep | undefined> {
      const res = await RegistrationRepository.checkAuthenticatedUser();
      if (isHttpError(res)) return;

      const step = castRegistrationStepWithDate(res);
      if (isRegistrationCompletedStep(step)) {
        this.fullyRegistered = true;
      }
      if (isRegistrationFormStep(step)) {
        this.prefilledRegisterForm = {
          userData: step.user,
          passwordRequirement: step.passwordRequirement,
        };
      }
      return step;
    },

    async checkEmail(email: string): Promise<RegistrationStep | undefined> {
      const res = await RegistrationRepository.checkUnauthenticatedUser(email);
      if (isHttpError(res)) return;

      const step = castRegistrationStepWithDate(res);
      if (isRegistrationFormStep(step)) {
        this.prefilledRegisterForm = {
          userData: step.user,
          passwordRequirement: step.passwordRequirement,
        };
      }
      return step;
    },

    clearRegistrationData() {
      this.prefilledRegisterForm = undefined;
      this.fullyRegistered = false;
    },

    async forgetMe(credentials: Credentials, token: string) {
      const res = await RegistrationRepository.forgetMe(credentials, token);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        "Les informations liées à ce compte sont supprimées 🗑️",
      );
    },

    async forget(_membership: Membership, email: string) {
      const res = await RegistrationRepository.forgetHim(email);
      if (isHttpError(res)) return;
      sendSuccessNotification("Bénévole supprimé 🗑️");
    },
  },
});

function castRegistrationStepWithDate(
  step: HttpStringified<RegistrationStep>,
): RegistrationStep {
  if (isRegistrationFormStep(step)) {
    return {
      ...step,
      user: step.user
        ? {
            ...step.user,
            birthDate: step.user.birthDate
              ? new Date(step.user.birthDate)
              : undefined,
          }
        : undefined,
    };
  }
  return step;
}
