import { AxiosResponse } from "axios";
import { SnackNotif } from "../models/store";

// Define all success messages possible
const successMessages = {
  sent: "Bien envoyé !",
  saved: "Sauvegardé !",
};

// Define all error messages possible
const errorMessages = {
  server: "Erreur Serveur",
};

type SuccessMessageKey = keyof typeof successMessages;
type ErrorMessageKey = keyof typeof errorMessages;

export async function safeCall<T = any>(
  store: Vue["$store"],
  repoFunction: Promise<AxiosResponse<T>>,
  successMessage?: SuccessMessageKey,
  errorMessage?: ErrorMessageKey
): Promise<AxiosResponse<T> | undefined> {
  try {
    const res = await repoFunction;
    if (res.status >= 400) {
      throw new Error();
    }
    if (successMessage) {
      const notif: SnackNotif = {
        type: "success",
        message: successMessage,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return res;
  } catch (error: any) {
    if (errorMessage) {
      const notif: SnackNotif = {
        type: "error",
        message: errorMessage,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return undefined;
  }
}
