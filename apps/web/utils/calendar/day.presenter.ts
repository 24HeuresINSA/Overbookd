import { Duration, ONE_DAY_IN_MS, OverDate, Period } from "@overbookd/time";

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
    return OverDate.init({
      date: this.date.dateString,
      hour: 0,
      minute: 0,
    });
  }

  get endsAt(): OverDate {
    return OverDate.init({
      date: this.date.dateString,
      hour: 23,
      minute: 59,
    });
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
}
