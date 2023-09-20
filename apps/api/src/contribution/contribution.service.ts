import { Injectable } from "@nestjs/common";
import { PayContribution, PayContributionForm } from "@overbookd/contribution";
import { Adherent } from "@overbookd/contribution";

@Injectable()
export class ContributionService {
  constructor(private readonly payContribution: PayContribution) {}

  async findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.payContribution.findAdherentsWithContributionOutToDate();
  }

  async pay(contributionData: PayContributionForm): Promise<void> {
    await this.payContribution.for(contributionData);
  }
}
