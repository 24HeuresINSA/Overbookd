import { Contribution, UserContribution } from "./contribution.model";
import { HasAlreadyPayed, InsufficientAmount } from "./pay-contribution.error";
import { ONE_YEAR_IN_MS } from "@overbookd/period";

const BASE_EDITION = 49
const BASE_EDITION_STARTS = new Date("2023-09-01");
const MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS = 100;
const AUGUST = 7
const EXIPIRATION_DATE = {
  month: AUGUST,
  day: 31
}


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

    if (amount < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS) {
      throw new InsufficientAmount();
    }

    return {
      userId,
      amount,
      paymentDate: new Date(),
      expirationDate: this.calculeExpirationDate(),
      edition,
    };
  }

  private calculeExpirationDate(): Date {
    const currentDate = new Date();
    const { month, day } = EXIPIRATION_DATE;
    const expirationDate = new Date(currentDate.getFullYear(), month, day);

    if (currentDate > expirationDate) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    return expirationDate;
  }

  static getCurrentEdition(): number {
    return this.findEdition(new Date());
  }

  private static findEdition(date: Date): number {
    const durationAfterBaseEdition = date.getTime() - BASE_EDITION_STARTS.getTime();
    const editionAfterBaseEdition = Math.floor(durationAfterBaseEdition / ONE_YEAR_IN_MS);
    return BASE_EDITION + editionAfterBaseEdition;
  }
  
}
