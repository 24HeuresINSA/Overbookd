import { Contribution } from "./contribution.model";

export interface PayContributionForm {
  amount: number;
  userId: number;
}

export interface ContributionRepository {
  hasAlreadyPayed(userId: number, edition: number): Promise<boolean>;
}

export class PayContribution {
  constructor(private readonly contributions: ContributionRepository) {}

  async apply({ userId, amount }: PayContributionForm): Promise<Contribution> {
    const edition = this.getCurrentEdition();

    const hasAlreadyPayed = await this.contributions.hasAlreadyPayed(
      userId, edition
    );
    if (hasAlreadyPayed) throw new Error("Already payed");

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
    const expirationDate = new Date(currentDate.getFullYear(), 7, 31);

    if (currentDate > expirationDate) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    return expirationDate;
  }

  private getCurrentEdition(): number {
    const currentDate = new Date();

    // current year to edition (2024 -> 49th edition)
    const currentEdition = currentDate.getFullYear() - 1975;

    // if current month is after august, increment edition
    if (currentDate.getMonth() > 7) return currentEdition + 1;
    return currentEdition;
  }
}
