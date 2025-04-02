import { EVENT_DATE_KEY } from "@overbookd/configuration";

export default defineNuxtRouteMiddleware(async () => {
  const teamStore = useTeamStore();
  const configurationStore = useConfigurationStore();

  await Promise.all([
    teamStore.fetchTeams(),
    configurationStore.fetch(EVENT_DATE_KEY),
  ]);
});
