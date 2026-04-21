import { IProvidePeriod, Period, Duration } from "@overbookd/time";

export type BreakDefinition = {
  volunteer: number;
  name: string;
  during: { start: Date; duration: Duration };
};

export type BreakPeriod = IProvidePeriod & {
  name: string;
};

export type Breaks = {
  of(volunteer: number): Promise<BreakPeriod[]>;
  save(volunteer: number, breaks: BreakPeriod[]): Promise<BreakPeriod[]>;
  remove(
    volunteer: number,
    breakPeriod: IProvidePeriod,
  ): Promise<BreakPeriod[]>;
};

export type BreakIdentifier = {
  volunteer: number;
  period: IProvidePeriod;
};

export class BreakPeriods {
  constructor(private readonly breaks: Breaks) {}

  async for({
    volunteer,
    name,
    during: { start, duration },
  }: BreakDefinition): Promise<BreakPeriod[]> {
    const breaks = await this.breaks.of(volunteer);
    const endTimestamp = start.getTime() + duration.inMilliseconds;
    const breakPeriod = { name, start, end: new Date(endTimestamp) };
    const allBreaks = [...breaks, breakPeriod];
    return this.breaks.save(volunteer, allBreaks);
  }

  async of(volunteer: number): Promise<BreakPeriod[]> {
    return this.breaks.of(volunteer);
  }

  remove({ volunteer, period }: BreakIdentifier): Promise<BreakPeriod[]> {
    return this.breaks.remove(volunteer, Period.init(period));
  }
}
