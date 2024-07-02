export const CASK_MODE = "cask";
export const CLOSET_MODE = "closet";
export const DEPOSIT_MODE = "deposit";

export type SgMode =
  | typeof CASK_MODE
  | typeof CLOSET_MODE
  | typeof DEPOSIT_MODE;
