export const BASE_EDITION_STARTS = new Date("2023-09-01");

const BASE_EDITION = 49;

export class Edition {
  static get current(): number {
    return this.findEdition(new Date());
  }

  private static findEdition(date: Date): number {
    const currentYear = date.getUTCFullYear();
    const editionStartThisYear = Date.UTC(
      currentYear,
      BASE_EDITION_STARTS.getUTCMonth(),
      BASE_EDITION_STARTS.getUTCDate(),
    );
    const yearsSinceBaseEdition =
      currentYear - BASE_EDITION_STARTS.getUTCFullYear();
    const isBeforeEditionStart = date.getTime() < editionStartThisYear;
    const editionsAfterBaseEdition = isBeforeEditionStart
      ? yearsSinceBaseEdition - 1
      : yearsSinceBaseEdition;

    return BASE_EDITION + editionsAfterBaseEdition;
  }

  static on(date: Date): number {
    return Edition.findEdition(date);
  }
}
