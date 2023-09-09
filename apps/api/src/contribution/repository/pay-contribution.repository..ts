import {
  ContributionResponse,
  PayContributionForm,
} from "@overbookd/contribution";

export interface PayContributionRepository {
  pay: (contribution: PayContributionForm) => Promise<ContributionResponse>;
  find: (userId: number) => Promise<ContributionResponse | null>;
}
