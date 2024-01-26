import { ONE_HOUR_IN_MS } from "./duration.constant";
import { IProvidePeriod, Period } from "./period";

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

// https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range/70307091#39495173
type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type Hour = Enumerate<24>;

const PARIS_TIMEZONE: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Paris",
};

const DISPLAY_HOUR: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
};

export class OverDate {
  protected constructor(
    protected readonly _date: Date,
    protected readonly _hour: Hour,
  ) {}

  static init({ date, hour }: { date: DateString; hour: Hour }) {
    const hours = hour.toString().padStart(2, "0");
    const dateString = `${date}T${hours}:00+02:00`;
    return new OverDate(new Date(dateString), hour);
  }

  static from(international: Date) {
    const [hourWithPad] = Intl.DateTimeFormat("fr", DISPLAY_HOUR)
      .format(international)
      .split(":");
    const hour = +hourWithPad;

    const [day, month, year] = Intl.DateTimeFormat("fr", PARIS_TIMEZONE)
      .format(international)
      .split("/");
    const date = `${year}-${month}-${day}`;

    if (!isDateString(date) || !isHour(hour)) throw new Error();

    return OverDate.init({ date, hour });
  }

  get date(): Date {
    return this._date;
  }

  get hour(): Hour {
    return this._hour;
  }

  get period(): Period {
    const start = this.date;
    const end = new Date(this.date.getTime() + ONE_HOUR_IN_MS);
    return Period.init({ start, end });
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

export function isHour(hour: number): hour is Hour {
  return hour >= 0 && hour < 24;
}
