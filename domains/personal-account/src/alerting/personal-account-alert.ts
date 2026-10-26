import { NEGATIVE_BALANCE } from "./in-debt-alerting.constant";

export type Summary = typeof NEGATIVE_BALANCE;

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
