import { CURRENT_BALANCE_MESSAGE } from "../current-balance/current-balance.constant";
import { NEGATIVE_BALANCE } from "../in-debt/in-debt-alerting.constant";

export type Summary = typeof NEGATIVE_BALANCE | typeof CURRENT_BALANCE_MESSAGE;

export type IAlertAboutPersonalAccount = {
  summary: Summary;
  balance: number;
};

export class PersonalAccountAlert implements IAlertAboutPersonalAccount {
  constructor(
    readonly summary: Summary,
    readonly balance: number,
  ) {}
}
