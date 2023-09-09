import { Injectable } from "@nestjs/common";
import {
  PayContributionForm,
  ContributionResponse,
} from "@overbookd/contribution";
import { PayContributionRepository } from "./repository/pay-contribution.repository.";

@Injectable()
export class ContributionService {
  constructor(
    private readonly payContributionRepository: PayContributionRepository,
  ) {}

  async pay(
    contributionData: PayContributionForm,
  ): Promise<ContributionResponse> {
    return this.payContributionRepository.pay(contributionData);
  }

  async find(userId: number): Promise<ContributionResponse | null> {
    return this.payContributionRepository.find(userId);
  }

  async remove(userId: number): Promise<void> {
    return this.payContributionRepository.remove(userId);
  }
}
