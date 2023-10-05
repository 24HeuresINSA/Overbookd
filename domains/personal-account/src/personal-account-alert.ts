import { CURRENT_BALANCE_MESSAGE } from "./current-balance";
import { NEGATIVE_BALANCE } from "./in-debt";

export type Summary = typeof NEGATIVE_BALANCE | typeof CURRENT_BALANCE_MESSAGE;

export interface IAlertAboutPersonalAccount {
  summary: Summary;
  balance: number;
}

export class PersonalAccountAlert implements IAlertAboutPersonalAccount {
  constructor(readonly summary: Summary, readonly balance: number) {}
}
