import { PAY_CONTRIBUTION } from "@overbookd/permission";
import { PayContributions, Member } from "./pay-contribution.js";
import {
  Adherent,
  Contribution,
  ContributionIdentity,
  areSameContributions,
} from "../contribution.js";

export class InMemoryPayContributions implements PayContributions {
  constructor(
    private contributions: Contribution[],
    private readonly members: Member[],
  ) {}

  private get adherents(): Adherent[] {
    return (
      this.members
        .filter((member) => member.permissions.includes(PAY_CONTRIBUTION))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ permissions, ...adherent }) => adherent)
    );
  }

  pay(contribution: Contribution): Promise<Contribution> {
    this.contributions = [...this.contributions, contribution];
    return Promise.resolve(contribution);
  }

  findAdherentsOutToDate(edition: number): Promise<Adherent[]> {
    const adherents = this.adherents.filter((adherent) => {
      const contributionIdentity = { adherentId: adherent.id, edition };
      return !this.has(contributionIdentity);
    });
    return Promise.resolve(adherents);
  }

  isAllowedToPay(memberId: number): Promise<boolean> {
    const isAdherent = this.adherents.some(
      (adherent) => adherent.id === memberId,
    );
    return Promise.resolve(isAdherent);
  }

  hasAlreadyPayed(adherentId: number, edition: number): Promise<boolean> {
    const contributionIdentity = { adherentId, edition };
    const hasAlreadyPayed = this.has(contributionIdentity);
    return Promise.resolve(hasAlreadyPayed);
  }

  has(contributionIdentity: ContributionIdentity): boolean {
    return this.contributions.some((contribution) =>
      areSameContributions(contributionIdentity, contribution),
    );
  }
}
