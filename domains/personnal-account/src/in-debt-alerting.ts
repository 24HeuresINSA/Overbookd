import {
  PERSONNAL_ACCOUNT_FINANCING,
  NEGATIVE_BALANCE,
} from "./in-debt-alerting.constant";

export interface Adherents {
  getBalance(adherentId: number): Promise<number>;
}

export interface Alert {
  summary: string;
  details: string;
}

class InDebtAlert implements Alert {
  summary: string;
  details: string;

  constructor(balance: number) {
    const details = `Tu es à ${balance} ${PERSONNAL_ACCOUNT_FINANCING}`;
    this.summary = NEGATIVE_BALANCE;
    this.details = details;
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
