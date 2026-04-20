import { Period } from "@overbookd/time";
import { BreakPeriod, Breaks } from "./break-periods";

export class InMemoryBreakRepository implements Breaks {
  constructor(private breaks: Map<number, BreakPeriod[]>) {}

  of(volunteer: number): Promise<BreakPeriod[]> {
    return Promise.resolve(this.breaks.get(volunteer) ?? []);
  }

  save(volunteer: number, breaks: BreakPeriod[]): Promise<BreakPeriod[]> {
    this.breaks.set(volunteer, breaks);
    return Promise.resolve(breaks);
  }

  remove(volunteer: number, breakPeriod: BreakPeriod): Promise<BreakPeriod[]> {
    const breaks = this.breaks.get(volunteer);
    if (!breaks) return Promise.resolve([]);
    const toRemove = Period.init(breakPeriod);
    const remainingBreaks = breaks.filter(
      (storedBreak) => !toRemove.equals(storedBreak),
    );
    this.breaks.set(volunteer, remainingBreaks);
    return Promise.resolve(remainingBreaks);
  }
}
