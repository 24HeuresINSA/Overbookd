import { Period } from "@overbookd/period";
import { Breaks } from "./break-periods";

export class InMemoryBreakRepository implements Breaks {
  constructor(private breaks: Map<number, Period[]>) {}

  of(volunteer: number): Promise<Period[]> {
    return Promise.resolve(this.breaks.get(volunteer) ?? []);
  }

  save(volunteer: number, breaks: Period[]): Promise<Period[]> {
    this.breaks.set(volunteer, breaks);
    return Promise.resolve(breaks);
  }

  remove(volunteer: number, breakPeriod: Period): Promise<Period[]> {
    const breaks = this.breaks.get(volunteer);
    if (!breaks) return Promise.resolve([]);
    const remainingBreaks = breaks.filter(
      (storedBreak) => !storedBreak.equals(breakPeriod),
    );
    this.breaks.set(volunteer, remainingBreaks);
    return Promise.resolve(remainingBreaks);
  }
}
