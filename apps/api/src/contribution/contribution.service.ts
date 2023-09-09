import { Injectable } from "@nestjs/common";
import { PayContributionForm, UserContribution } from "@overbookd/contribution";
import { PayContributionRepository } from "./repository/pay-contribution.repository.";

@Injectable()
export class ContributionService {
  constructor(
    private readonly payContributionRepository: PayContributionRepository,
  ) {}

  async pay(contributionData: PayContributionForm): Promise<UserContribution> {
    return this.payContributionRepository.pay(contributionData);
  }

  async find(userId: number): Promise<UserContribution | null> {
    return this.payContributionRepository.find(userId);
  }

  async remove(userId: number): Promise<void> {
    return this.payContributionRepository.remove(userId);
  }
}
