import {
  DateString,
  Hour,
  ONE_HOUR_IN_MS,
  OverDate,
  Period,
} from "@overbookd/period";
import { SHIFT_HOURS } from "./shift.constant";
import { AvailabilityDateOddHourError } from "./volunteer-availability.error";

export type InitOverDate = {
  date: DateString;
  hour: Hour;
};

export class AvailabilityDate extends OverDate {
  static init({ date, hour }: InitOverDate) {
    const isOdd = hour % 2 !== 0;
    const happenOutsideNightShift =
      AvailabilityDate.happenOutsidePartyShift(hour);
    if (isOdd && happenOutsideNightShift)
      throw new AvailabilityDateOddHourError();

    const hours = hour.toString().padStart(2, "0");
    const dateString = `${date}T${hours}:00+02:00`;
    return new AvailabilityDate(new Date(dateString), hour);
  }

  get period(): Period {
    const start = this.date;
    const end = new Date(this.date.getTime() + this.perdiodDuration);
    return Period.init({ start, end });
  }

  private get perdiodDuration(): number {
    const durationInHours = AvailabilityDate.happenOutsidePartyShift(this.hour)
      ? 2
      : 1;
    return durationInHours * ONE_HOUR_IN_MS;
  }

  private static happenOutsidePartyShift(hour: Hour) {
    const happenBeforePartyShift = hour < SHIFT_HOURS.PARTY;
    const happenAfterNightShift = hour >= SHIFT_HOURS.NIGHT;
    return happenBeforePartyShift && happenAfterNightShift;
  }
}
