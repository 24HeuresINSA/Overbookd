import { ONE_HOUR_IN_MS } from "../duration/duration.constant.js";
import { Duration } from "../duration/duration.js";
import { IProvidePeriod, Period } from "../period/period.js";
import {
  formatDateNumberValue,
} from "./format-date.utils.js";

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

type Offset = "01" | "02";

export const PARIS_TIMEZONE: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Paris",
};

const DISPLAY_TIMEZONE: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  timeZoneName: "short",
};

export const DISPLAY_DATE: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export const DISPLAY_TIME: Intl.DateTimeFormatOptions = {
  ...PARIS_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
};

export const DISPLAY_DATE_TIME: Intl.DateTimeFormatOptions = {
  ...DISPLAY_DATE,
  ...DISPLAY_TIME,
};

export type InitOverDate = {
  date: DateString;
  hour: Hour;
  minute?: Minute;
};

type MonthlyDate<M extends Month> = { month: M; day: Day<M> };

type OverDateDefinition = {
  year: Year;
  monthlyDate: MonthlyDate<Month>;
  hour: Hour;
  minute: Minute;
  offset: Offset;
};

export class OverDate {
  protected constructor(protected readonly definition: OverDateDefinition) {}

  static init(init: InitOverDate): OverDate {
    const definition = OverDate.defineFrom(init);
    return new OverDate(definition);
  }

  protected static defineFrom(init: InitOverDate): OverDateDefinition {
    const { date, hour, minute = 0 } = init;
    const [year, month, day] = date.split("-");

    const monthlyDate = { month, day };

    if (!isMonthlyDate(monthlyDate)) throw new Error();

    const hours = formatDateNumberValue(hour);
    const minutes = formatDateNumberValue(minute);
    const datetime = `${date}T${hours}:${minutes}`;

    const offset = extractOffset(new Date(datetime));

    return { year: +year, monthlyDate, minute, hour, offset };
  }

  static from(international: string): OverDate;
  static from(international: Date): OverDate;
  static from(international: number): OverDate;
  static from(international: Date | string | number): OverDate {
    const internationalDate = new Date(international);

    const [hourWithPad, minuteWithPad] = Intl.DateTimeFormat("fr", DISPLAY_TIME)
      .format(internationalDate)
      .split(":");
    const hour = +hourWithPad;
    const minute = +minuteWithPad;

    const [day, month, year] = Intl.DateTimeFormat("fr", DISPLAY_DATE)
      .format(internationalDate)
      .split("/");

    const monthlyDate = { month, day };

    if (!isMonthlyDate(monthlyDate) || !isHour(hour) || !isMinute(minute))
      throw new Error();

    const offset = extractOffset(internationalDate);

    return new OverDate({ year: +year, monthlyDate, hour, minute, offset });
  }

  static fromLocal(local: Date): OverDate {
    const year = local.getFullYear();
    const month = formatDateNumberValue(local.getMonth() + 1);
    const day = formatDateNumberValue(local.getDate());

    const monthlyDate = { month, day };

    const hour = local.getHours();
    const minute = local.getMinutes();

    if (!isMonthlyDate(monthlyDate) || !isHour(hour) || !isMinute(minute))
      throw new Error();

    const offset = extractOffset(local);

    return new OverDate({ year, monthlyDate, hour, minute, offset });
  }

  static now(): OverDate {
    return OverDate.fromLocal(new Date());
  }

  get date(): Date {
    const { month, day } = this.definition.monthlyDate;
    const date = `${this.definition.year}-${month}-${day}`;
    const time = `${formatDateNumberValue(this.hour)}:${formatDateNumberValue(this.minute)}`;
    return new Date(`${date}T${time}+${this.definition.offset}:00`);
  }

  get dateString(): DateString {
    const { month, day } = this.definition.monthlyDate;
    return `${this.definition.year}-${month}-${day}` as DateString;
  }

  get year(): Year {
    return this.definition.year;
  }

  get monthlyDate(): MonthlyDate<Month> {
    return this.definition.monthlyDate;
  }

  get hour(): Hour {
    return this.definition.hour;
  }

  get minute(): Minute {
    return this.definition.minute;
  }

  private get timestamp(): number {
    return this.date.getTime();
  }

  get period(): Period {
    const start = this.date;
    const end = new Date(this.timestamp + ONE_HOUR_IN_MS);
    return Period.init({ start, end });
  }

  isIncludedBy(periods: IProvidePeriod[]): boolean {
    return periods.some((period) => Period.init(period).isIncluding(this.date));
  }

  plus(duration: Duration): OverDate {
    return OverDate.from(this.timestamp + duration.inMilliseconds);
  }

  minus(duration: Duration): OverDate {
    return OverDate.from(this.timestamp - duration.inMilliseconds);
  }
}

const DATE_TEMPORAL_PARTS = 3;

export function isDateString(dateString: string): dateString is DateString {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  return dateString.split("-").length === DATE_TEMPORAL_PARTS;
}

function isMonthlyDate(monthlyDate: {
  month: string;
  day: string;
}): monthlyDate is MonthlyDate<Month> {
  return (
    isMonth(monthlyDate.month) && isDayOf(monthlyDate.month, monthlyDate.day)
  );
}

function isMonth(month: string): month is Month {
  return month.length === 2 && +month > 0 && +month <= 12;
}

function isDayOf<M extends Month>(month: M, day: string): day is Day<M> {
  const maxDayOfTheMonth =
    month === "02" ? 28 : ["04", "06", "09", "11"].includes(month) ? 30 : 31;
  return day.length === 2 && +day > 0 && +month <= maxDayOfTheMonth;
}

export function isHour(hour: number): hour is Hour {
  return hour >= 0 && hour < 24;
}

export function isMinute(minute: number): minute is Minute {
  return minute >= 0 && minute < 60;
}

function isOffset(offset: string): offset is Offset {
  return offset === "01" || offset === "02";
}

function extractOffset(date: Date): Offset {
  const parisTime = new Intl.DateTimeFormat("fr", DISPLAY_TIMEZONE)
    .formatToParts(date)
    .find((value) => value.type === "timeZoneName")?.value;

  const offsetSearched = parisTime?.match(/UTC[+-](\d)/);

  const offset = (offsetSearched?.at(1) ?? "").padStart(2, "0");

  if (!isOffset(offset)) throw new Error(offset);

  return offset;
}
