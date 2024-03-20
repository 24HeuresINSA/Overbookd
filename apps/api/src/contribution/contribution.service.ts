import { Injectable } from "@nestjs/common";
import {
  Adherent,
  Contribution,
  Edition,
  EditContribution,
  PayContribution,
  PayContributionForm,
  AdherentWithContribution,
} from "@overbookd/contribution";

@Injectable()
export class ContributionService {
  constructor(
    private readonly payContribution: PayContribution,
    private readonly editAmount: EditContribution,
  ) {}

  async findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.payContribution.findAdherentsWithContributionOutToDate();
  }

  async findAdherentsWithValidContribution(): Promise<
    AdherentWithContribution[]
  > {
    const edition = Edition.current;
    return this.editAmount.findAdherentsWithValidContribution(edition);
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
