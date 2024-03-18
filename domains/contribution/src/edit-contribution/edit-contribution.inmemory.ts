import { Contribution } from "../contribution";
import { EditContributions } from "./edit-contribution";
import { NotFoundContribution } from "./edit-contribution.error";
import { updateItemToList } from "@overbookd/list";

export class InMemoryEditContributions implements EditContributions {
  constructor(private contributions: Contribution[] = []) {}

  get all(): Contribution[] {
    return this.contributions;
  }

  findCurrentContributions(edition: number): Promise<Contribution[]> {
    const contributions = this.contributions.filter(
      (contribution) => edition === contribution.edition,
    );
    return Promise.resolve(contributions);
  }

  find(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<Contribution | null> {
    const contribution = this.contributions.find(
      (contribution) =>
        contribution.adherentId === adherentId &&
        contribution.edition === edition,
    );
    return Promise.resolve(contribution || null);
  }

  save(contribution: Contribution): Promise<Contribution> {
    const contributionIndex = this.contributions.findIndex(
      (toUpdate) =>
        toUpdate.adherentId === contribution.adherentId &&
        toUpdate.edition === contribution.edition,
    );
    if (contributionIndex == -1) throw new NotFoundContribution();

    this.contributions = updateItemToList(
      this.contributions,
      contributionIndex,
      contribution,
    );
    return Promise.resolve(contribution);
  }

  remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void> {
    this.contributions = this.contributions.filter(
      (contribution) =>
        contribution.adherentId !== adherentId &&
        contribution.edition !== edition,
    );
    return Promise.resolve();
  }
}
