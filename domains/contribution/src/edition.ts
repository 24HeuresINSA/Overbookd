import { ONE_YEAR_IN_MS } from "@overbookd/period";

const BASE_EDITION_STARTS = new Date("2023-09-01");

export const BASE_EDITION = 49;
export const BASE_EDITION_ENDS = new Date("2024-08-31");

export class Edition {
  static get current(): number {
    return this.findEdition(new Date());
  }

  private static findEdition(date: Date): number {
    const dateTimestamp = date.getTime();
    const baseEditionTimestamp = BASE_EDITION_STARTS.getTime();

    const durationAfterBaseEdition = dateTimestamp - baseEditionTimestamp;

    const durationInYears = durationAfterBaseEdition / ONE_YEAR_IN_MS;
    const editionsAfterBaseEdition = Math.floor(durationInYears);

    return BASE_EDITION + editionsAfterBaseEdition;
  }
}
