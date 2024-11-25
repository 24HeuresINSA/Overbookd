import {
  InitOverDate,
  Hour,
  OverDate,
  ONE_HOUR_IN_MS,
  Period,
} from "@overbookd/time";
import { SHIFT_HOURS } from "./shift.constant.js";
import { AvailabilityDateOddHourError } from "./volunteer-availability.error.js";

export class AvailabilityDate extends OverDate {
  static init({ date, hour }: InitOverDate) {
    const isOdd = hour % 2 !== 0;
    const happenOutsideNightShift = happenOutsidePartyShift(hour);
    if (isOdd && happenOutsideNightShift) {
      throw new AvailabilityDateOddHourError();
    }

    const definition = OverDate.defineFrom({ date, hour });

    return new AvailabilityDate(definition);
  }

  get period(): Period {
    const start = this.date;
    const end = new Date(this.date.getTime() + this.perdiodDuration);
    return Period.init({ start, end });
  }

  private get perdiodDuration(): number {
    const durationInHours = happenOutsidePartyShift(this.hour) ? 2 : 1;
    return durationInHours * ONE_HOUR_IN_MS;
  }
}

function happenOutsidePartyShift(hour: Hour) {
  const happenBeforePartyShift = hour < SHIFT_HOURS.PARTY;
  const happenAfterNightShift = hour >= SHIFT_HOURS.NIGHT;
  return happenBeforePartyShift && happenAfterNightShift;
}
