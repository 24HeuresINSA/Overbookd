import { type Membership, RegisterForm } from "@overbookd/registration";
import type {
  Credentials,
  FulfilledRegistration,
} from "@overbookd/registration";
import { isHttpError } from "~/utils/http/http-error.utils";
import { RegistrationRepository } from "~/repositories/registration/registration.repository";

type State = {
  prefilledUserData?: Partial<FulfilledRegistration>;
};

export const useRegistrationStore = defineStore("registration", {
  state: (): State => ({
    prefilledUserData: undefined,
  }),
  actions: {
    async register(form: RegisterForm, token?: string): Promise<boolean> {
      const res = await RegistrationRepository.registerNewcomer(form, token);
      this.prefilledUserData = undefined;
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

    setPrefilledUserData(data?: Partial<FulfilledRegistration>) {
      this.prefilledUserData = data;
    },
  },
});
