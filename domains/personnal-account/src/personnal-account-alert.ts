export interface IAlertAboutPersonnalAccount {
  summary: string;
  balance: number;
}

export class PersonnalAccountAlert implements IAlertAboutPersonnalAccount {
  constructor(readonly summary: string, readonly balance: number) {}
}
