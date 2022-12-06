import { AxiosResponse } from "axios";
import { SnackNotif } from "../models/store";

export async function safeCall<T = any>(
  store: Vue["$store"],
  repoFunction: Promise<AxiosResponse<T>>,
  successMessage?: string,
  errorMessage?: string
): Promise<AxiosResponse<T> | undefined> {
  try {
    const res = await repoFunction;
    if (res.status >= 400) {
      throw new Error();
    }
    if (successMessage) {
      const notif: SnackNotif = {
        message: successMessage,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return res;
  } catch (error: any) {
    if (errorMessage) {
      const notif: SnackNotif = {
        message: errorMessage,
      };
      store.dispatch("notif/pushNotification", notif);
    }
    return undefined;
  }
}
