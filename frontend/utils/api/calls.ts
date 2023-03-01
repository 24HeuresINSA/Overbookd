import { AxiosResponse } from "axios";
import { SnackNotif } from "../models/store";

interface ActionMessage {
  successMessage?: string;
  errorMessage?: string;
}

export async function safeCall<T = any>(
  store: Vue["$store"],
  repoFunction: Promise<AxiosResponse<T>>,
  message?: ActionMessage
): Promise<AxiosResponse<T> | undefined> {
  try {
    const res = await repoFunction;
    if (res.status >= 400) {
      throw new Error();
    }
    if (message?.successMessage) {
      const notif: SnackNotif = {
        message: message.successMessage,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return res;
  } catch (error: any) {
    const notifMessage = getNotifMessage(error, message?.errorMessage);
    const notif: SnackNotif = {
      message: notifMessage,
    };
    store.dispatch("notif/pushNotification", notif);
    return undefined;
  }
}

function getNotifMessage(error: any, customErrorMessage?: string) {
  if (customErrorMessage) {
    return customErrorMessage;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Une erreur est survenue 😢";
}
