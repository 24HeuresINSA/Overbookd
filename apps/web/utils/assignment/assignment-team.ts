import { ALL_TEAM_MEMBERS } from "@overbookd/festival-event-constants";

export function formatTeamCount(count: number): string {
  return count === ALL_TEAM_MEMBERS ? "Tous" : count.toString();
}
