import { ONE_HOUR_IN_MS } from "../duration/duration.constant.js";
import { IProvidePeriod, Period } from "../period/period.js";
import { formatDateNumberValue, formatLocalDate } from "./format-date.utils.js";

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
export type Minute = Enumerate<60>;

export const PARIS_TIMEZONE: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Paris",
};

export const DISPLAY_DATE_TIME: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export const DISPLAY_DATE: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export const DISPLAY_HOUR: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
};

export type InitOverDate = {
  date: DateString;
  hour: Hour;
  minute?: Minute;
};

export class OverDate {
  protected constructor(
    protected readonly _date: Date,
    protected readonly _hour: Hour,
    protected readonly _minute: Minute = 0,
  ) {}

  static init({ date, hour, minute = 0 }: InitOverDate): OverDate {
    const hours = formatDateNumberValue(hour);
    const minutes = formatDateNumberValue(minute);
    const datetime = `${date}T${hours}:${minutes}`;

    const offset = OverDate.getParisTimeZoneOffset(new Date(datetime));

    const dateString = `${datetime}+0${offset}:00`;
    return new OverDate(new Date(dateString), hour, minute);
  }

  static getParisTimeZoneOffset(date: Date): number {
    const parisTime = new Intl.DateTimeFormat("fr", {
      ...PARIS_TIMEZONE,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((value) => value.type === "timeZoneName")?.value;

    const offset = parisTime?.match(/UTC[+-](\d)/);

    if (!offset) throw new Error();

    return +offset[1];
  }

  static from(international: Date): OverDate {
    const [hourWithPad, minuteWithPad] = Intl.DateTimeFormat("fr", DISPLAY_HOUR)
      .format(international)
      .split(":");
    const hour = +hourWithPad;
    const minute = +minuteWithPad;

    const [day, month, year] = Intl.DateTimeFormat("fr", DISPLAY_DATE)
      .format(international)
      .split("/");
    const date = `${year}-${month}-${day}`;

    if (!isDateString(date) || !isHour(hour) || !isMinute(minute))
      throw new Error();

    return OverDate.init({ date, hour, minute });
  }

  static fromLocal(local: Date): OverDate {
    const year = local.getFullYear();
    const month = formatDateNumberValue(local.getMonth() + 1);
    const day = formatDateNumberValue(local.getDate());
    const date = `${year}-${month}-${day}`;

    const hour = local.getHours();
    const minute = local.getMinutes();

    if (!isDateString(date) || !isHour(hour) || !isMinute(minute))
      throw new Error();

    return OverDate.init({ date, hour, minute });
  }

  static getStartOfDay(day: Date): OverDate {
    return OverDate.init({
      date: OverDate.from(day).dateString,
      hour: 0,
    });
  }

  get date(): Date {
    return this._date;
  }

  get dateString(): DateString {
    const date = formatLocalDate(this._date);
    if (!isDateString(date)) throw new Error("Date invalide");
    return date;
  }

  get hour(): Hour {
    return this._hour;
  }

  get minute(): Minute {
    return this._minute;
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

export function isMinute(minute: number): minute is Minute {
  return minute >= 0 && minute < 60;
}
