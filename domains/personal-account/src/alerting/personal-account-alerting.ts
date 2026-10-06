import { Adherents } from "./adherents.js";
import { InDebtAlert } from "./in-debt-alert.js";

export class PersonalAccountAlerting {
  constructor(private readonly adherents: Adherents) {}

  async for(adherentId: number) {
    const balance = await this.adherents.getBalance(adherentId);
    if (balance >= 0) return undefined;
    return new InDebtAlert(balance);
  }
}
