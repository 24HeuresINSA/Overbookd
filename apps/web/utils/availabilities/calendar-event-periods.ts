import { OverDate, Period, Duration } from "@overbookd/time";

export type CalendarStep = {
  title: string;
  period: Period;
};

export class CalendarEventPeriods {
  private static get start(): OverDate {
    const configurationStore = useConfigurationStore();
    return OverDate.fromLocal(configurationStore.eventStartDate);
  }

  private static get startCollage(): OverDate {
    return CalendarEventPeriods.removeDays(39);
    // TODO : Récupérer la bonne valeur pour le début de la semaine orga dans la configuration
    // J'ai fais ca pour tester que tout fonctionnais bien !
    //
    // const configurationStore = useConfigurationStore();
    // return OverDate.fromLocal(configurationStore.orgaWeekStartDate);
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

  public static get collage(): CalendarStep[] {
    const collagePeriod = Period.init({
      start: CalendarEventPeriods.startCollage.date,
      end: CalendarEventPeriods.removeDays(12).date,
    });

    const weeklyPeriods = collagePeriod.splitWithInterval(Duration.ONE_WEEK);

    return weeklyPeriods.map((period, index) => ({
      title: `Collage - S${index + 1}`,
      period: Period.init({
        start: period.start,
        end:
          index === weeklyPeriods.length - 1
            ? period.end
            : OverDate.from(period.end).minus(Duration.ONE_DAY).date,
      }),
    }));
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
