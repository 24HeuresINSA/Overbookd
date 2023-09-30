import { NEGATIVE_BALANCE } from "./in-debt-alerting.constant";

export interface Adherents {
  getBalance(adherentId: number): Promise<number>;
}

export interface PersonnalAccountAlert {
  summary: string;
  balance: number;
}

class InDebtAlert implements PersonnalAccountAlert {
  summary: string;

  constructor(readonly balance: number) {
    this.summary = NEGATIVE_BALANCE;
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
