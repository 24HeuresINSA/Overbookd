import { BASE_EDITION, BASE_EDITION_ENDS, Edition } from "./edition";

const AUGUST = 7;

export const EXPIRATION_DATE = {
  month: AUGUST,
  day: 31,
};

export type ContributionIdentity = {
  adherentId: number;
  edition: number;
};

export type Contribution = ContributionIdentity & {
  amount: number;
  paymentDate: Date;
  expirationDate: Date;
};

export class Contribute {
  static now(adherentId: number, amount: number): Contribution {
    const edition = Edition.current;
    const paymentDate = new Date();
    const expirationDate = this.calculeExpirationDate(edition);

    return {
      adherentId,
      edition,
      amount,
      paymentDate,
      expirationDate,
    };
  }

  private static calculeExpirationDate(edition: number): Date {
    const yearsSinceBaseEdition = edition - BASE_EDITION;
    const expirationDateYear =
      BASE_EDITION_ENDS.getFullYear() + yearsSinceBaseEdition;

    return new Date(
      expirationDateYear,
      EXPIRATION_DATE.month,
      EXPIRATION_DATE.day,
    );
  }
}
