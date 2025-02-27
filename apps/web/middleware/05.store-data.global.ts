import { EVENT_DATE_KEY } from "@overbookd/configuration";

export default defineNuxtRouteMiddleware(() => {
  const teamStore = useTeamStore();
  if (teamStore.teams.length === 0) teamStore.fetchTeams();

  const configurationStore = useConfigurationStore();
  configurationStore.fetch(EVENT_DATE_KEY);
});
