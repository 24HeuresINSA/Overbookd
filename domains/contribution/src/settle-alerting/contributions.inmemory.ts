import { Contributions, IDefineContribution } from "./settle-alerting";

export class InMemoryContributions implements Contributions {
  constructor(private readonly contributions: IDefineContribution[]) { }

  hasAlreadyContribute(contributionId: IDefineContribution): Promise<boolean> {
    return Promise.resolve(
      this.contributions.some(
        ({ adherentId, edition }) => contributionId.adherentId === adherentId &&
          contributionId.edition === edition
      )
    );
  }
}
