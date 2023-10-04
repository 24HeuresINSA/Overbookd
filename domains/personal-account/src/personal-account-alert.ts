export interface IAlertAboutPersonalAccount {
  summary: string;
  balance: number;
}

export class PersonalAccountAlert implements IAlertAboutPersonalAccount {
  constructor(readonly summary: string, readonly balance: number) {}
}
