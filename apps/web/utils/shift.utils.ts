import { SHIFT_HOURS } from "@overbookd/volunteer-availability";

export function isPartyShift(hour: number): boolean {
  return hour >= SHIFT_HOURS.PARTY || hour < SHIFT_HOURS.NIGHT;
}
