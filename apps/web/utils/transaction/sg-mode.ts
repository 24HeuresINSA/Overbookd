export const CASK_MODE = "cask";
export const CLOSET_MODE = "closet";
export const DEPOSIT_MODE = "deposit";
export const EXTERNAL_EVENT_MODE = "external-event";

export type SgMode =
  | typeof CASK_MODE
  | typeof CLOSET_MODE
  | typeof DEPOSIT_MODE
  | typeof EXTERNAL_EVENT_MODE;
