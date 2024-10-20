import { type Membership, RegisterForm } from "@overbookd/registration";
import type { Credentials } from "@overbookd/registration";
import { isHttpError } from "~/utils/http/http-error.utils";
import { RegistrationRepository } from "~/repositories/registration/registration.repository";

export const useRegistrationStore = defineStore("registration", {
  actions: {
    async register(form: RegisterForm, token?: string): Promise<boolean> {
      const res = await RegistrationRepository.registerNewcomer(form, token);
      if (isHttpError(res)) return false;
      sendSuccessNotification("Merci pour ton inscription 🎉");
      return true;
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
