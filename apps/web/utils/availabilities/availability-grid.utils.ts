import {
  HOURS_IN_DAY,
  OverDate,
  Period,
  type Hour,
  type IProvidePeriod,
} from "@overbookd/time";
import { SHIFT_HOURS } from "@overbookd/volunteer-availability";
import { isPartyShift } from "../shift.utils";
import type { SavedCharismaPeriod } from "@overbookd/http";

const TWO_HOURS_CELL_COUNT = (SHIFT_HOURS.PARTY - SHIFT_HOURS.NIGHT) / 2;
const ONE_HOUR_CELL_COUNT = HOURS_IN_DAY - TWO_HOURS_CELL_COUNT * 2;
export const CELLS_IN_DAY = TWO_HOURS_CELL_COUNT + ONE_HOUR_CELL_COUNT;

export type AvailabilityCell = IProvidePeriod & {
  start: Date;
  end: Date;
  duration: number;
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
};

export type AvailabilityCellWithCharisma = AvailabilityCell & {
  charisma: number;
};

export function findCharismaPerHour(
  charismaPeriods: SavedCharismaPeriod[],
  date: Date,
): number {
  const charismaPeriod = charismaPeriods.find((cp) =>
    Period.init({ start: cp.start, end: cp.end }).isIncluding(date),
  );
  if (!charismaPeriod) return 0;
  const isOneHourShift = isPartyShift(date.getHours());
  return isOneHourShift ? charismaPeriod.charisma : charismaPeriod.charisma * 2;
}

export function generateAvailabilityCells(
  dayStart: OverDate,
  dayIndex: number,
): AvailabilityCell[] {
  return generateBaseAvailabilityCells(dayStart, dayIndex, () => ({}));
}

export function generateAvailabilityCellsWithCharisma(
  dayStart: OverDate,
  dayIndex: number,
  charismaPeriods: SavedCharismaPeriod[],
): AvailabilityCellWithCharisma[] {
  return generateBaseAvailabilityCells(dayStart, dayIndex, (start) => ({
    charisma: findCharismaPerHour(charismaPeriods, start.date),
  }));
}

function generateBaseAvailabilityCells<T extends object>(
  dayStart: OverDate,
  dayIndex: number,
  enrichCellData: (start: OverDate) => T,
): (AvailabilityCell & T)[] {
  let hour: Hour = 0;
  return Array.from({ length: CELLS_IN_DAY }, (_, cellIndex) => {
    const start = OverDate.init({
      date: dayStart.dateString,
      hour: hour,
    });

    const duration = isPartyShift(hour) ? 1 : 2;
    const end = OverDate.init({
      date: dayStart.dateString,
      hour: Math.min(hour + duration, HOURS_IN_DAY) as Hour,
    });

    const rowStart = cellIndex + 1;
    const rowEnd = rowStart + duration - 1;

    hour += duration;

    return {
      start: start.date,
      end: end.date,
      duration: duration,
      rowStart,
      rowEnd,
      columnStart: dayIndex + 1,
      columnEnd: dayIndex + 2,
      ...enrichCellData(start),
    };
  });
}

export const cellDurationClass = (cell: AvailabilityCell) => {
  return cell.duration === 1 ? "cell-1h" : "cell-2h";
};

export const cellGridStyle = (cell: AvailabilityCell) => {
  return {
    gridRowStart: cell.rowStart,
    gridRowEnd: cell.rowEnd,
    gridColumnStart: cell.columnStart,
    gridColumnEnd: cell.columnEnd,
  };
};
