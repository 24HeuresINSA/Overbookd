import {
  Duration,
  formatDateDayFullName,
  formatDateDayNumber,
  ONE_DAY_IN_MS,
  OverDate,
  Period,
} from "@overbookd/time";
import type { CalendarEvent } from "./event";

export type CalendarDay = {
  name: string;
  number: number;
  date: OverDate;
};

export class DayPresenter {
  constructor(public readonly date: OverDate) {}

  get monday(): OverDate {
    const currentDay = this.startsAt.date.getDay();
    const isSunday = currentDay === 0;
    const baseOffset = isSunday ? -6 : 1;
    const daysToMonday = baseOffset - currentDay;

    const durationToMonday = Duration.ms(ONE_DAY_IN_MS * daysToMonday);
    return this.startsAt.plus(durationToMonday);
  }

  get startsAt(): OverDate {
    return OverDate.init({ date: this.date.dateString, hour: 0, minute: 0 });
  }

  get endsAt(): OverDate {
    return OverDate.init({ date: this.date.dateString, hour: 23, minute: 59 });
  }

  get calendarHeader(): CalendarDay {
    const name = formatDateDayFullName(this.date.date).toUpperCase();
    const number = +formatDateDayNumber(this.date.date);
    return { name, number, date: this.date };
  }

  get weekDays(): DayPresenter[] {
    const monday = this.monday;
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const daysFromMondayInMs = Duration.ms(i * ONE_DAY_IN_MS);
      return monday.plus(daysFromMondayInMs);
    });
    return weekDates.map((day) => new DayPresenter(day));
  }

  get displayableDate(): string {
    const day = this.date.date.toLocaleDateString("fr-FR", { day: "2-digit" });
    const month = this.date.date.toLocaleDateString("fr-FR", { month: "long" });
    return `${day} ${month} ${this.date.year}`;
  }

  get displayableMonthWithYear(): string {
    const month = this.date.date.toLocaleDateString("fr-FR", { month: "long" });
    return `${month} ${this.date.year}`;
  }

  isSameDayThan(other: OverDate): boolean {
    return (
      this.date.year === other.year &&
      this.date.monthlyDate.month === other.monthlyDate.month &&
      this.date.monthlyDate.day === other.monthlyDate.day
    );
  }

  isSameWeekThan(other: OverDate): boolean {
    const nextMonday = this.monday.plus(Duration.ONE_WEEK);
    const week = Period.init({ start: this.monday.date, end: nextMonday.date });
    return week.isIncluding(other.date);
  }

  eventsOccuringThatDayAmong(events: CalendarEvent[]): CalendarEvent[] {
    return events.filter((event) => Period.init(event).isInDay(this.date.date));
  }

  nextDay(): DayPresenter {
    return new DayPresenter(this.date.plus(Duration.ONE_DAY));
  }

  previousDay(): DayPresenter {
    return new DayPresenter(this.date.minus(Duration.ONE_DAY));
  }
}
