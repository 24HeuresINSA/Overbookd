import { AxiosResponse } from "axios";
import { SnackNotif } from "../models/store";

// Define all success messages possible
const successMessages = {
  sent: "Bien envoyé !",
};

// Define all error messages possible
const errorMessages = {
  server: "Erreur Serveur",
};

type SuccessMessageKey = keyof typeof successMessages;
type ErrorMessageKey = keyof typeof errorMessages;

export async function safeCall(
  store: Vue["$store"],
  repoFunction: Promise<AxiosResponse<any>>,
  successMessage?: SuccessMessageKey,
  errorMessage?: ErrorMessageKey
): Promise<AxiosResponse | undefined> {
  try {
    const res = await repoFunction;
    if (res.status !== 200) {
      throw new Error();
    }
    if (successMessage) {
      const notif: SnackNotif = {
        type: "success",
        message: successMessages[successMessage],
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return res;
  } catch (error: any) {
    if (errorMessage) {
      const notif: SnackNotif = {
        type: "error",
        message: errorMessages[errorMessage],
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return undefined;
  }
}
