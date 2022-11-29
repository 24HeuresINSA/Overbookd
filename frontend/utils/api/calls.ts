import { AxiosResponse } from "axios";
import { SnackNotif } from "../models/store";

export async function safeCall(
  store: Vue["$store"],
  repoFunction: Promise<AxiosResponse<any>>,
  successMessage?: string,
  errorMessage?: string
): Promise<AxiosResponse | undefined> {
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
