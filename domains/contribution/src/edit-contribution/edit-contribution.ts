import {
  Adherent,
  Contribution,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
} from "../contribution.js";
import { InsufficientAmount } from "../contribution.error.js";
import { NotFoundContribution } from "./edit-contribution.error.js";

export type AdherentWithContribution = Adherent & {
  amount: Contribution["amount"];
  paymentDate: Contribution["paymentDate"];
  edition: Contribution["edition"];
};

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

export type Adherents = {
  find(adherentId: Adherent["id"]): Promise<Adherent | undefined>;
};

export class EditContribution {
  constructor(
    private readonly contributions: EditContributions,
    private readonly adherents: Adherents,
  ) {}

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

    return this.contributions.save({ ...contribution, amount });
  }

  async findAdherentsWithValidContribution(
    edition: Contribution["edition"],
  ): Promise<AdherentWithContribution[]> {
    const contributions =
      await this.contributions.findCurrentContributions(edition);

    const contributionsWithAdherent = await Promise.all(
      contributions.map(async ({ adherentId, amount, paymentDate }) => {
        const adherent = await this.adherents.find(adherentId);
        if (!adherent) return null;
        return { amount, paymentDate, edition, ...adherent };
      }),
    );

    return contributionsWithAdherent.filter(
      (contribution): contribution is AdherentWithContribution =>
        contribution !== null,
    );
  }

  async remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void> {
    await this.contributions.remove(adherentId, edition);
  }
}
