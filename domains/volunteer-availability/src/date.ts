import { IProvidePeriod, ONE_HOUR_IN_MS, Period } from "@overbookd/period";
import { SHIFT_HOURS } from "./shift.constant";
import { AvailabilityDateOddHourError } from "./volunteer-availability.error";

type January = "01";
type February = "02";
type March = "03";
type April = "04";
type May = "05";
type June = "06";
type July = "07";
type August = "08";
type September = "09";
type October = "10";
type November = "11";
type December = "12";

type With30Days = April | June | September | November;
type With31Days = January | March | May | July | August | October | December;

type TwentyEightDays =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28";
type ThirtyDays = TwentyEightDays | "29" | "30";
type ThirtyOneDays = ThirtyDays | "31";

type Year = number;
type Month = February | With30Days | With31Days;
type Day<M extends Month> = M extends February
  ? TwentyEightDays
  : M extends With30Days
    ? ThirtyDays
    : ThirtyOneDays;

type FebruaryDateString = `${Year}-${February}-${Day<February>}`;
type With30DaysDateString = `${Year}-${With30Days}-${Day<With30Days>}`;
type With31DaysDateString = `${Year}-${With31Days}-${Day<With31Days>}`;
export type DateString =
  | FebruaryDateString
  | With30DaysDateString
  | With31DaysDateString;

const PARIS_TIMEZONE: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Paris",
};

const DISPLAY_HOUR: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
};

export class AvailabilityDate {
  constructor(
    private readonly _date: Date,
    private readonly _hour: number,
  ) {}

  static init({ date, hour }: { date: DateString; hour: number }) {
    const isOdd = hour % 2 !== 0;
    const happenOutsideNightShift =
      AvailabilityDate.happenOutsidePartyShift(hour);
    if (isOdd && happenOutsideNightShift)
      throw new AvailabilityDateOddHourError();

    const hours = hour.toString().padStart(2, "0");
    const dateString = `${date}T${hours}:00+02:00`;
    return new AvailabilityDate(new Date(dateString), hour);
  }

  static from(international: Date) {
    const [hourWithPad] = Intl.DateTimeFormat("fr", DISPLAY_HOUR)
      .format(international)
      .split(":");
    const hour = +hourWithPad;

    const [day, mounth, year] = Intl.DateTimeFormat("fr", PARIS_TIMEZONE)
      .format(international)
      .split("/");
    const date = `${year}-${mounth}-${day}`;

    if (!isDateString(date)) throw new Error();

    return AvailabilityDate.init({ date, hour });
  }

  get date(): Date {
    return this._date;
  }

  get hour(): number {
    return this._hour;
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

  private static happenOutsidePartyShift(hour: number) {
    const happenBeforePartyShift = hour < SHIFT_HOURS.PARTY;
    const happenAfterNightShift = hour >= SHIFT_HOURS.NIGHT;
    return happenBeforePartyShift && happenAfterNightShift;
  }

  isIncludedBy(periods: IProvidePeriod[]): boolean {
    return periods.some((period) => Period.init(period).isIncluding(this.date));
  }
}

const DATE_TEMPORAL_PARTS = 3;

export function isDateString(dateString: string): dateString is DateString {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  return dateString.split("-").length === DATE_TEMPORAL_PARTS;
}
