import { Injectable } from "@nestjs/common";
import { PayContribution, PayContributionForm, UserContribution } from "@overbookd/contribution";
import { PrismaPayContributionRepository } from "./repository/pay-contribution-repository.prisma";
import { UserPersonnalData } from "@overbookd/user";

@Injectable()
export class ContributionService {
  constructor(
    private readonly payContributionRepository: PrismaPayContributionRepository,
    private readonly payContribution: PayContribution,
  ) {}

  // find users with no contribution for the current edition
  async findMembersWithContributionOutToDate(): Promise<UserPersonnalData[]> {
    return this.payContributionRepository.findMembersWithContributionOutToDate();
  }

  async pay(contributionData: PayContributionForm): Promise<UserContribution> {
    const contribution = await this.payContribution.for(contributionData);
    return this.payContributionRepository.pay(contribution);
  }

  async remove(userId: number): Promise<void> {
    return this.payContributionRepository.remove(userId);
  }
}
