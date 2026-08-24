import { type Membership, RegisterForm } from "@overbookd/registration";
import type { Credentials } from "@overbookd/registration";
import { isHttpError } from "~/utils/http/http-error.utils";
import { RegistrationRepository } from "~/repositories/registration/registration.repository";
import {
  hasHttpStringifiedRegistrationFormData,
  type RegistrationCompletedStep,
  type RegistrationFormStep,
  type RegistrationFormStepWithData,
  type RegistrationLoginStep,
} from "@overbookd/http";

export const useRegistrationStore = defineStore("registration", {
  actions: {
    async register(form: RegisterForm, token?: string): Promise<boolean> {
      const res = await RegistrationRepository.registerNewcomer(form, token);
      if (isHttpError(res)) return false;
      sendSuccessNotification("Merci pour ton inscription 🎉");
      return true;
    },

    async checkAuthenticatedUser(): Promise<
      RegistrationFormStep | RegistrationCompletedStep | undefined
    > {
      const res =
        await RegistrationRepository.checkAuthenticatedUserWithFormData();
      if (isHttpError(res)) return;
      if (hasHttpStringifiedRegistrationFormData(res)) {
        return {
          ...res,
          user: res.user
            ? {
                ...res.user,
                birthDate: res.user.birthDate
                  ? new Date(res.user.birthDate)
                  : undefined,
              }
            : undefined,
        };
      }
      return res;
    },

    async checkEmail(
      email: string,
    ): Promise<
      RegistrationLoginStep | RegistrationFormStepWithData | undefined
    > {
      const res = await RegistrationRepository.checkUnauthenticatedUser(email);
      if (isHttpError(res)) return;
      if (hasHttpStringifiedRegistrationFormData(res)) {
        return {
          ...res,
          user: res.user
            ? {
                ...res.user,
                birthDate: res.user.birthDate
                  ? new Date(res.user.birthDate)
                  : undefined,
              }
            : undefined,
        };
      }
      return res;
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
