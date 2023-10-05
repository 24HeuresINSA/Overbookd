import { Contributions, IDefineContribution } from "./settle-alerting";

export class InMemoryContributions implements Contributions {
  constructor(private readonly contributions: IDefineContribution[]) {}

  mine(adherentId: number): Promise<IDefineContribution[]> {
    return Promise.resolve(
      this.contributions.filter(
        (contribution) => contribution.adherentId === adherentId,
      ),
    );
  }
}
