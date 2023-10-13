import { PersonalAccountAlert } from "../alerting/personal-account-alert";
import { NEGATIVE_BALANCE } from "./in-debt-alerting.constant";

export class InDebtAlert extends PersonalAccountAlert {
  constructor(balance: number) {
    super(NEGATIVE_BALANCE, balance);
  }
}
