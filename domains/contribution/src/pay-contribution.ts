import { Contribution, UserContribution } from "./contribution.model";
import { HasAlreadyPayed, InsufficientAmount } from "./pay-contribution.error";
import { ONE_YEAR_IN_MS } from "@overbookd/period";

const BASE_EDITION = 49
const BASE_EDITION_STARTS = new Date("2023-09-01");

export interface PayContributionForm {
  amount: number;
  userId: number;
}

export interface ContributionRepository {
  pay: (contribution: Contribution) => Promise<UserContribution>;
  hasAlreadyPayed(userId: number, edition: number): Promise<boolean>;
}

export class PayContribution {
  constructor(private readonly contributions: ContributionRepository) {}

  async for({ userId, amount }: PayContributionForm): Promise<Contribution> {
    const edition = PayContribution.getCurrentEdition();

    const hasAlreadyPayed = await this.contributions.hasAlreadyPayed(
      userId,
      edition,
    );
    if (hasAlreadyPayed) throw new HasAlreadyPayed();

    if (amount < 100) throw new InsufficientAmount();

    return {
      userId,
      amount,
      paymentDate: new Date(),
      expirationDate: PayContribution.calculeExpirationDate(),
      edition,
    };
  }

  private static calculeExpirationDate(): Date {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getFullYear(), 7, 31);

    if (currentDate > expirationDate) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    return expirationDate;
  }

  static getCurrentEdition(): number {
    return PayContribution.findEdition(new Date());
  }

  private static findEdition(date: Date): number {
    const durationAfterBaseEdition = date.getTime() - BASE_EDITION_STARTS.getTime();
    const editionAfterBaseEdition = Math.floor(durationAfterBaseEdition / ONE_YEAR_IN_MS);
    return BASE_EDITION + editionAfterBaseEdition;
  }
  
}
