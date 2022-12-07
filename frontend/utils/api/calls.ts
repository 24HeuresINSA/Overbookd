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
    if (message?.errorMessage) {
      const notif: SnackNotif = {
        message: message.errorMessage,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return undefined;
  }
}
