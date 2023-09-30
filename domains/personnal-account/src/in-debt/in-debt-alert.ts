import { PersonnalAccountAlert } from "../personnal-account-alert";
import { NEGATIVE_BALANCE } from "./in-debt-alerting.constant";

export class InDebtAlert extends PersonnalAccountAlert {
  constructor(balance: number) {
    super(NEGATIVE_BALANCE, balance);
  }
}
