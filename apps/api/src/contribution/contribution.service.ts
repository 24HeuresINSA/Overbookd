import { Injectable } from "@nestjs/common";
import {
  Adherent,
  Contribution,
  EditContribution,
  PayContribution,
  PayContributionForm,
  AdherentWithContribution,
} from "@overbookd/contribution";
import { Edition } from "@overbookd/time";

@Injectable()
export class ContributionService {
  constructor(
    private readonly payContribution: PayContribution,
    private readonly editContribution: EditContribution,
  ) {}

  async findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.payContribution.findAdherentsWithContributionOutToDate();
  }

  async findAdherentsWithValidContribution(): Promise<
    AdherentWithContribution[]
  > {
    const edition = Edition.current;
    return this.editContribution.findAdherentsWithValidContribution(edition);
  }

  async pay(contributionData: PayContributionForm): Promise<void> {
    await this.payContribution.for(contributionData);
  }

  async edit(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
    type: Contribution["type"],
  ): Promise<void> {
    await this.editContribution.type(adherentId, edition, type);
  }

  async remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void> {
    await this.editContribution.remove(adherentId, edition);
  }
}
