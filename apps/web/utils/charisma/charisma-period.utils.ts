import { Period } from "@overbookd/time";
import type { SavedCharismaPeriod } from "@overbookd/http";
import { BLUE_24_RGB } from "../vuetify/theme/common";

// TODO: should need more test with period have parts of it in several charismaPeriod
export function getPeriodCharisma(
  charismaPeriods: SavedCharismaPeriod[],
  period: Period,
): number {
  const charismaPeriod = charismaPeriods.find((charismaPeriod) =>
    Period.init(charismaPeriod).includes(period),
  );
  const charisma = charismaPeriod?.charisma ?? 0;

  return period.duration.inHours * charisma;
}

function lightenColor(colorLevel: number, lighterRatio: number): number {
  return Math.round(colorLevel - (colorLevel / 2) * lighterRatio);
}

function getCharismaColorLevels(
  charisma: number,
  maxCharisma: number,
): {
  red: number;
  blue: number;
  green: number;
} {
  const ratio = maxCharisma === 0 ? 0 : charisma / maxCharisma;
  return {
    red: lightenColor(BLUE_24_RGB[0], ratio),
    green: lightenColor(BLUE_24_RGB[1], ratio),
    blue: lightenColor(BLUE_24_RGB[2], ratio),
  };
}

export function getCharismaColor(
  charisma: number,
  maxCharisma: number,
): string {
  const { red, blue, green } = getCharismaColorLevels(charisma, maxCharisma);
  return `rgb(${red}, ${green}, ${blue})`;
}
