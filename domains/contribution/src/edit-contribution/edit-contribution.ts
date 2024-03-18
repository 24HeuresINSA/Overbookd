import {
  Contribution,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
} from "../contribution";
import { InsufficientAmount } from "../contribution.error";
import { NotFoundContribution } from "./edit-contribution.error";

export type EditContributions = {
  findCurrentContributions(
    edition: Contribution["edition"],
  ): Promise<Contribution[]>;
  find(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<Contribution | null>;
  save(contribution: Contribution): Promise<Contribution>;
  remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void>;
};

export class EditContribution {
  constructor(private readonly contributions: EditContributions) {}

  async amount(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
    amount: number,
  ): Promise<Contribution> {
    const contribution = await this.contributions.find(adherentId, edition);
    if (!contribution) throw new NotFoundContribution();

    if (amount < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS) {
      throw new InsufficientAmount();
    }

    contribution.amount = amount;
    return this.contributions.save(contribution);
  }

  async findCurrentContributions(
    edition: Contribution["edition"],
  ): Promise<Contribution[]> {
    return this.contributions.findCurrentContributions(edition);
  }

  async remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void> {
    await this.contributions.remove(adherentId, edition);
  }
}
