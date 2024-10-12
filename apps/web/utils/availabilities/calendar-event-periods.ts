import { OverDate, Period } from "@overbookd/time";

export type CalendarStep = {
  title: string;
  period: Period;
};

export class CalendarEventPeriods {
  private static get start(): OverDate {
    const configurationStore = useConfigurationStore();
    return OverDate.from(configurationStore.eventStartDate);
  }

  private static addDays(days: number): OverDate {
    const result = new Date(CalendarEventPeriods.start.date);
    result.setDate(result.getDate() + days);
    return OverDate.from(result);
  }

  private static removeDays(days: number): OverDate {
    const result = new Date(CalendarEventPeriods.start.date);
    result.setDate(result.getDate() - days);
    return OverDate.from(result);
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
        start: CalendarEventPeriods.start.date,
        end: CalendarEventPeriods.addDays(3).date,
      }),
    };
  }

  public static get postManif(): CalendarStep {
    return {
      title: "Post-festival",
      period: Period.init({
        start: CalendarEventPeriods.addDays(4).date,
        end: CalendarEventPeriods.addDays(6).date,
      }),
    };
  }
}
