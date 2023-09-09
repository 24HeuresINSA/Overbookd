import { UserContribution, PayContributionForm } from "@overbookd/contribution";

export interface PayContributionRepository {
  pay: (contribution: PayContributionForm) => Promise<UserContribution>;
  find: (userId: number) => Promise<UserContribution | null>;
  remove: (userId: number) => Promise<void>;
}
