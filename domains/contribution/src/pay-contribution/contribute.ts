import { Contribution } from "../contribution.js";
import { BASE_EDITION_STARTS, Edition } from "@overbookd/time";

const AUGUST = 7;

export const EXPIRATION_DATE = {
  month: AUGUST,
  day: 31,
};

const EDITION_DURATION_IN_YEAR = 1;

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
    const editionsSinceBaseEdition = edition - Edition.on(BASE_EDITION_STARTS);
    const baseEditionYear = BASE_EDITION_STARTS.getFullYear();
    const currentEditionStartYear = baseEditionYear + editionsSinceBaseEdition;
    const year = currentEditionStartYear + EDITION_DURATION_IN_YEAR;
    const { month, day } = EXPIRATION_DATE;

    return new Date(year, month, day);
  }
}
