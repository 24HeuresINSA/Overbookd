import { AxiosResponse } from "axios";
import { SnackNotif } from "../models/notif.model";

type ActionMessage = {
  successMessage?: string;
  errorMessage?: string;
  messageDuration?: number;
};

export async function safeCall<T>(
  store: Vue["$store"],
  repoFunction: Promise<AxiosResponse<T>>,
  message?: ActionMessage,
): Promise<AxiosResponse<T> | undefined> {
  try {
    const res = await repoFunction;
    if (res.status >= 400) {
      throw new Error();
    }
    if (message?.successMessage) {
      const notif: SnackNotif = {
        message: message.successMessage,
        timeout: message.messageDuration,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return res;
  } catch (error: unknown) {
    const notifMessage = getNotifMessage(error, message?.errorMessage);
    const notif: SnackNotif = {
      message: notifMessage,
      timeout: message?.messageDuration,
    };
    store.dispatch("notif/pushNotification", notif);
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- can't cast error to specific type
function getNotifMessage(error: any, customErrorMessage?: string) {
  if (customErrorMessage) {
    return customErrorMessage;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Une erreur est survenue 😢";
}
