import { IProvidePeriod } from "@overbookd/period";
import { Period, Duration } from "@overbookd/period";

export type BreakDefinition = {
  volunteer: number;
  during: { start: Date; duration: Duration };
};

export type Breaks = {
  of(volunteer: number): Promise<Period[]>;
  save(volunteer: number, breaks: Period[]): Promise<Period[]>;
  remove(volunteer: number, breakPeriod: Period): Promise<Period[]>;
};

export type BreakIdentifier = {
  volunteer: number;
  period: IProvidePeriod;
};

export class BreakPeriods {
  constructor(private readonly breaks: Breaks) {}

  async for({
    volunteer,
    during: { start, duration },
  }: BreakDefinition): Promise<Period[]> {
    const breaks = await this.breaks.of(volunteer);
    const endTimestamp = start.getTime() + duration.inMilliseconds;
    const breakPeriod = Period.init({ start, end: new Date(endTimestamp) });
    const allBreaks = [...breaks, breakPeriod];
    return this.breaks.save(volunteer, allBreaks);
  }

  async of(volunteer: number): Promise<Period[]> {
    return this.breaks.of(volunteer);
  }

  remove({ volunteer, period }: BreakIdentifier): Promise<Period[]> {
    return this.breaks.remove(volunteer, Period.init(period));
  }
}
