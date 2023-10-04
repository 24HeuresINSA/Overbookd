import { Adherents } from "./adherents";
import { CurrentBalanceAlert } from "./current-balance/current-balance-alert";
import { InDebtAlert } from "./in-debt/in-debt-alert";

export class PersonalAccountAlerting {
  constructor(private readonly adherents: Adherents) {}

  async for(adherentId: number) {
    const balance = await this.adherents.getBalance(adherentId);
    if (balance < 0) return new InDebtAlert(balance);
    if (balance > 0) return new CurrentBalanceAlert(balance);
    return undefined;
  }
}
