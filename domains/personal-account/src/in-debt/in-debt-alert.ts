import { PersonalAccountAlert } from "../alerting/personal-account-alert.js";
import { NEGATIVE_BALANCE } from "./in-debt-alerting.constant.js";

export class InDebtAlert extends PersonalAccountAlert {
  constructor(balance: number) {
    super(NEGATIVE_BALANCE, balance);
  }
}
