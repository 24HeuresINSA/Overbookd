import { HAVE_TO_SETTLE_CONTRIBUTION } from "./settle-alerting.constant";

type Summary = typeof HAVE_TO_SETTLE_CONTRIBUTION;

export interface IAlertAboutContribution {
  summary: Summary;
  edition: number;
}

export class SettleAlert implements IAlertAboutContribution {
  readonly summary: Summary;

  constructor(readonly edition: number) {
    this.summary = HAVE_TO_SETTLE_CONTRIBUTION;
  }
}
