import { Permission } from "@overbookd/permission";
import { Contribution, Contribute } from "./contribute";
import {
  HasAlreadyPayed,
  InsufficientAmount,
  NotAllowedToPay,
} from "./pay-contribution.error";
import { Edition } from "./edition";

export const MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS = 100;

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

type WithPermission = {
  permissions: Permission[];
};

export type Member = Adherent & WithPermission;

export type PayContributionForm = {
  amount: number;
  adherentId: number;
};

export interface ContributionRepository {
  pay(contribution: Contribution): Promise<Contribution>;
  hasAlreadyPayed(adherentId: number, edition: number): Promise<boolean>;
  findAdherentsOutToDate(edition: number): Promise<Adherent[]>;
  isAllowedToPay(memberId: number): Promise<boolean>;
}

export class PayContribution {
  constructor(private readonly contributions: ContributionRepository) {}

  async for({
    adherentId,
    amount,
  }: PayContributionForm): Promise<Contribution> {
    const edition = Edition.current;

    const [isAllowedToPay, hasAlreadyPayed] = await Promise.all([
      this.contributions.isAllowedToPay(adherentId),
      this.contributions.hasAlreadyPayed(adherentId, edition),
    ]);
    if (!isAllowedToPay) throw new NotAllowedToPay();
    if (hasAlreadyPayed) throw new HasAlreadyPayed();

    if (amount < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS) {
      throw new InsufficientAmount();
    }

    const newContribution = Contribute.now(adherentId, amount);

    return this.contributions.pay(newContribution);
  }

  async findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.contributions.findAdherentsOutToDate(Edition.current);
  }
}
