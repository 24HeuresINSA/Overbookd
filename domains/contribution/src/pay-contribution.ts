import { Contribution } from "./contribution.model";

export interface PayContributionForm {
  amount: number;
  userId: number;
}

export class PayContribution {
  private constructor() {}

  static of(contributionForm: PayContributionForm): Contribution {
    return {
      ...contributionForm,
      paymentDate: new Date(),
      expirationDate: this.calculeExpirationDate(),
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
}
