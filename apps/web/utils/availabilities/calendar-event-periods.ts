import { OverDate, Period, Duration } from "@overbookd/time";

export type CalendarStep = {
  title: string;
  period: Period;
};

export class CalendarEventPeriods {
  private static get startManif(): OverDate {
    const configurationStore = useConfigurationStore();
    return OverDate.fromLocal(configurationStore.eventStartDate);
  }

  private static get startCollage(): OverDate {
    const configurationStore = useConfigurationStore();
    return OverDate.fromLocal(configurationStore.orgaWeekStartDate);
  }

  private static addDays(days: number): OverDate {
    const result = new Date(CalendarEventPeriods.startManif.date);
    result.setDate(result.getDate() + days);
    return OverDate.from(result);
  }

  private static removeDays(days: number): OverDate {
    const result = new Date(CalendarEventPeriods.startManif.date);
    result.setDate(result.getDate() - days);
    return OverDate.from(result);
  }

  public static get collages(): CalendarStep[] {
    const collagePeriod = Period.init({
      start: CalendarEventPeriods.startCollage.date,
      end: CalendarEventPeriods.removeDays(12).date,
    });

    const weeklyPeriods = collagePeriod.splitWithInterval(Duration.ONE_WEEK);

    return weeklyPeriods.map((period, index) => {
      const isLastCollage = index === weeklyPeriods.length - 1;
      const fixedEnd = isLastCollage
        ? period.end
        : OverDate.from(period.end).minus(Duration.ONE_DAY).date;
      return {
        title: `Collage - S${index + 1}`,
        period: Period.init({
          start: period.start,
          end: fixedEnd,
        }),
      };
    });
  }

  public static get prePreManif(): CalendarStep {
    return {
      title: "Pré-pré-festival",
      period: Period.init({
        start: CalendarEventPeriods.removeDays(11).date,
        end: CalendarEventPeriods.removeDays(5).date,
      }),
    };
  }

  public static get preManif(): CalendarStep {
    return {
      title: "Pré-festival",
      period: Period.init({
        start: CalendarEventPeriods.removeDays(4).date,
        end: CalendarEventPeriods.removeDays(1).date,
      }),
    };
  }

  public static get manif(): CalendarStep {
    return {
      title: "Festival",
      period: Period.init({
        start: CalendarEventPeriods.startManif.date,
        end: CalendarEventPeriods.addDays(2).date,
      }),
    };
  }

  public static get postManif(): CalendarStep {
    return {
      title: "Post-festival",
      period: Period.init({
        start: CalendarEventPeriods.addDays(3).date,
        end: CalendarEventPeriods.addDays(6).date,
      }),
    };
  }
}
