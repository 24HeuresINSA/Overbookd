import { BreakPeriod } from "../../break-periods/break-periods.js";
import { Volunteer } from "../../volunteer.js";
import { BreakPeriods } from "./planning.js";

export class InMemoryBreakPeriods implements BreakPeriods {
  constructor(private breakPeriods: Map<Volunteer["id"], BreakPeriod[]>) {}

  for(volunteer: Volunteer["id"]): Promise<BreakPeriod[]> {
    return Promise.resolve(this.breakPeriods.get(volunteer) ?? []);
  }
}
