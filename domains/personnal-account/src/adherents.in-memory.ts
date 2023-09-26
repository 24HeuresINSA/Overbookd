import { Adherents } from "./in-debt-alerting";

type Adherent = {
  id: number;
  balance: number;
};
export class InMemoryAdhrents implements Adherents {
  constructor(private adherents: Adherent[]) {}

  getBalance(adherentId: number): Promise<number> {
    return Promise.resolve(
      this.adherents.find(({ id }) => id === adherentId)?.balance ?? 0,
    );
  }
}
