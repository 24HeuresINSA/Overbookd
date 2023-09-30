import { PersonnalAccountAlert } from "../personnal-account-alert";
import { CURRENT_BALANCE_MESSAGE } from "./current-balance.constant";

export class CurrentBalanceAlert extends PersonnalAccountAlert {
  constructor(balance: number) {
    super(CURRENT_BALANCE_MESSAGE, balance);
  }
}
