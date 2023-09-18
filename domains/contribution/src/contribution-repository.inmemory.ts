import { Contribution } from "./contribution.model";
import { ContributionRepository } from "./pay-contribution";

export class InMemoryContributionRepository implements ContributionRepository {
  constructor(private contributions: Contribution[]) {}

  hasAlreadyPayed(userId: number, edition: number): Promise<boolean> {
    const hasAlreadyPayed = this.contributions.some(
      (c) => userId === c.userId && edition === c.edition
    );
    return Promise.resolve(hasAlreadyPayed);
  }
}
