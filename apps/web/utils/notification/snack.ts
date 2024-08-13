import { ONE_SECOND_IN_MS } from "@overbookd/period";

export const SUCCESS = "success";
export const FAILURE = "error";
export const INFO = "info";
export type NotificationType = typeof SUCCESS | typeof FAILURE | typeof INFO;

export type SnackNotification = {
  message: string;
  timeout: number;
  type: NotificationType;
};

export const DEFAULT_SNACK_TIMEOUT = 3 * ONE_SECOND_IN_MS;
