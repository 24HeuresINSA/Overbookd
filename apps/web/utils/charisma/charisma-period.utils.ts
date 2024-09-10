import { Period } from "@overbookd/time";
import type { SavedCharismaPeriod } from "@overbookd/http";

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
