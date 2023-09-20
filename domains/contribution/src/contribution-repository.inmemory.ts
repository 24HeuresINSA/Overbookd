import { Contribution, UserContribution } from "./contribution.model";
import { ContributionRepository, PayContribution } from "./pay-contribution";

export class InMemoryContributionRepository implements ContributionRepository {
  constructor(private contributions: Contribution[]) {}

  pay(contribution: Contribution): Promise<UserContribution> {
    this.contributions = [...this.contributions, contribution];
    return Promise.resolve({
      amount: contribution.amount,
      paymentDate: contribution.paymentDate,
    });
  }

  find(userId: number): Promise<UserContribution | null> {
    const currentEdition = PayContribution.getCurrentEdition();
    const contribution = this.contributions.find(
      (c) => userId === c.userId && currentEdition === c.edition,
    );
    return Promise.resolve(contribution || null);
  }

  remove(userId: number): Promise<void> {
    const currentEdition = PayContribution.getCurrentEdition();
    this.contributions = this.contributions.filter(
      (c) => userId !== c.userId || currentEdition !== c.edition,
    );
    return Promise.resolve();
  }

  hasAlreadyPayed(userId: number, edition: number): Promise<boolean> {
    const hasAlreadyPayed = this.contributions.some(
      (c) => userId === c.userId && edition === c.edition,
    );
    return Promise.resolve(hasAlreadyPayed);
  }
}
