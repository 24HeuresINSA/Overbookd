import {
  PERSONNAL_ACCOUNT_FINANCING,
  NEGATIVE_BALANCE,
} from "./in-debt-alerting.constant";

export interface Adherents {
  getBalance(adherentId: number): Promise<number>;
}

export interface Alert {
  message: string;
  description: string;
}

class InDebtAlert implements Alert {
  message: string;
  description: string;

  constructor(balance: number) {
    const description = `Tu es à ${balance} ${PERSONNAL_ACCOUNT_FINANCING}`;
    this.message = NEGATIVE_BALANCE;
    this.description = description;
  }
}

export class InDebtAlerting {
  constructor(private readonly adherents: Adherents) {}

  async for(adherentId: number) {
    const balance = await this.adherents.getBalance(adherentId);
    if (balance >= 0) return undefined;
    return new InDebtAlert(balance);
  }
}
