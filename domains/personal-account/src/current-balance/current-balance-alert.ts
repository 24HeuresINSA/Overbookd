import { PersonalAccountAlert } from "../personal-account-alert";
import { CURRENT_BALANCE_MESSAGE } from "./current-balance.constant";

export class CurrentBalanceAlert extends PersonalAccountAlert {
  constructor(balance: number) {
    super(CURRENT_BALANCE_MESSAGE, balance);
  }
}
