import { PersonalAccountAlert } from "../alerting/personal-account-alert.js";
import { CURRENT_BALANCE_MESSAGE } from "./current-balance.constant.js";

export class CurrentBalanceAlert extends PersonalAccountAlert {
  constructor(balance: number) {
    super(CURRENT_BALANCE_MESSAGE, balance);
  }
}
