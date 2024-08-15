import { ONE_YEAR_IN_MS } from "../duration/duration.constant";

export const BASE_EDITION_STARTS = new Date("2023-09-01");

const BASE_EDITION = 49;

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

  static on(date: Date): number {
    return Edition.findEdition(date);
  }
}
