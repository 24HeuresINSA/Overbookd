import { Hour, OverDate, ONE_HOUR_IN_MS, Period } from "@overbookd/time";
import { SHIFT_HOURS } from "./shift.constant.js";
import { Duration } from "@overbookd/time";

export class AvailabilityDate extends OverDate {
  static fromOverDate(date: OverDate): AvailabilityDate {
    const definition = OverDate.defineFrom({
      date: date.dateString,
      hour: date.hour,
    });
    return new AvailabilityDate(definition);
  }

  get period(): Period {
    const start = this.date;
    const end = this.plus(this.periodDuration).date;
    return Period.init({ start, end });
  }

  private get periodDuration(): Duration {
    const durationInHours = happenOutsidePartyShift(this.hour) ? 2 : 1;
    return Duration.ms(durationInHours * ONE_HOUR_IN_MS);
  }
}

function happenOutsidePartyShift(hour: Hour) {
  const happenBeforePartyShift = hour < SHIFT_HOURS.PARTY;
  const happenAfterNightShift = hour >= SHIFT_HOURS.NIGHT;
  return happenBeforePartyShift && happenAfterNightShift;
}
