import { Adherent, Contribution } from "../contribution.js";
import { NotFoundContribution } from "./edit-contribution.error.js";

export type AdherentWithContribution = Adherent & {
  type: Contribution["type"];
  paymentDate: Contribution["paymentDate"];
  edition: Contribution["edition"];
};

export type EditContributionForm = {
  type: Contribution["type"];
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

  async type(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
    type: Contribution["type"],
  ): Promise<Contribution> {
    const contribution = await this.contributions.find(adherentId, edition);
    if (!contribution) throw new NotFoundContribution();

    return this.contributions.save({ ...contribution, type });
  }

  async findAdherentsWithValidContribution(
    edition: Contribution["edition"],
  ): Promise<AdherentWithContribution[]> {
    const contributions =
      await this.contributions.findCurrentContributions(edition);

    const contributionsWithAdherent = await Promise.all(
      contributions.map(async ({ adherentId, type, paymentDate }) => {
        const adherent = await this.adherents.find(adherentId);
        if (!adherent) return null;
        return { type, paymentDate, edition, ...adherent };
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
