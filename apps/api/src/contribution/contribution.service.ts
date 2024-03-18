import { Injectable } from "@nestjs/common";
import { Contribution } from "@overbookd/contribution";
import {
  EditContribution,
  PayContribution,
  PayContributionForm,
} from "@overbookd/contribution";
import { Adherent } from "@overbookd/contribution";

@Injectable()
export class ContributionService {
  constructor(
    private readonly payContribution: PayContribution,
    private readonly editAmount: EditContribution,
  ) {}

  async findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.payContribution.findAdherentsWithContributionOutToDate();
  }

  async findValidContributionsOn(
    edition: Contribution["edition"],
  ): Promise<Contribution[]> {
    return this.editAmount.findCurrentContributions(edition);
  }

  async pay(contributionData: PayContributionForm): Promise<void> {
    await this.payContribution.for(contributionData);
  }

  async edit(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
    amount: number,
  ): Promise<void> {
    await this.editAmount.amount(adherentId, edition, amount);
  }

  async remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void> {
    await this.editAmount.remove(adherentId, edition);
  }
}
