import { EVENT_DATE_KEY, ORGA_WEEK_DATE_KEY } from "@overbookd/configuration";

export default defineNuxtRouteMiddleware(async () => {
  const teamStore = useTeamStore();
  const configurationStore = useConfigurationStore();

  const hasNoTeam = teamStore.teams.length === 0;
  const hasNoEventDate = !configurationStore.get(EVENT_DATE_KEY);
  const hasNoOrgaWeekDate = !configurationStore.get(ORGA_WEEK_DATE_KEY);

  const actions = [
    hasNoTeam ? teamStore.fetchTeams() : undefined,
    hasNoEventDate ? configurationStore.fetch(EVENT_DATE_KEY) : undefined,
    hasNoOrgaWeekDate
      ? configurationStore.fetch(ORGA_WEEK_DATE_KEY)
      : undefined,
  ].filter(Boolean);
  await Promise.all(actions);
});
