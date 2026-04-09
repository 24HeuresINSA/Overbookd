import { CurrentBalanceAlert } from "../balance/current-balance-alert.js";
import { InDebtAlert } from "../in-debt/in-debt-alert.js";
import { Adherents } from "./adherents.js";

export class PersonalAccountAlerting {
  constructor(private readonly adherents: Adherents) {}

  async for(adherentId: number) {
    const balance = await this.adherents.getBalance(adherentId);
    if (balance < 0) return new InDebtAlert(balance);
    if (balance > 0) return new CurrentBalanceAlert(balance);
    return undefined;
  }
}
