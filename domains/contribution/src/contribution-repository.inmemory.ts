import { PAY_CONTRIBUTION } from "@overbookd/permission";
import { Contribution } from "./contribution.model";
import { Adherent, ContributionRepository, Member } from "./pay-contribution";

export class InMemoryContributionRepository implements ContributionRepository {
  constructor(
    private contributions: Contribution[],
    private readonly members: Member[],
  ) {}

  private get adherents(): Adherent[] {
    return this.members
      .filter((member) => member.permissions.includes(PAY_CONTRIBUTION))
      .map(({ permissions, ...adherent }) => adherent);
  }

  pay(contribution: Contribution): Promise<Contribution> {
    this.contributions = [...this.contributions, contribution];
    return Promise.resolve(contribution);
  }

  findAdherentsOutToDate(edition: number): Promise<Adherent[]> {
    const adherents = this.adherents.filter(
      (adherent) =>
        !this.contributions.some(
          (contribution) =>
            contribution.userId === adherent.id &&
            contribution.edition === edition,
        ),
    );
    return Promise.resolve(adherents);
  }

  isAllowedToPay(userId: number): Promise<boolean> {
    const isAdherent = this.adherents.some(
      (adherent) => adherent.id === userId,
    );
    return Promise.resolve(isAdherent);
  }

  hasAlreadyPayed(userId: number, edition: number): Promise<boolean> {
    const hasAlreadyPayed = this.contributions.some(
      (c) => userId === c.userId && edition === c.edition,
    );
    return Promise.resolve(hasAlreadyPayed);
  }

  has(contribution: Contribution): boolean {
    return this.contributions.some(
      ({ userId, edition }) =>
        userId === contribution.userId && edition === contribution.edition,
    );
  }
}
