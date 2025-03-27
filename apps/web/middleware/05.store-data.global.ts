import { EVENT_DATE_KEY } from "@overbookd/configuration";

export default defineNuxtRouteMiddleware(async () => {
  const teamStore = useTeamStore();
  const configurationStore = useConfigurationStore();

  const actions = [
    teamStore.teams.length === 0 && teamStore.fetchTeams(),
    teamStore.faReviewers.length === 0 && teamStore.fetchFaReviewers(),
    teamStore.ftReviewers.length === 0 && teamStore.fetchFtReviewers(),
    configurationStore.fetch(EVENT_DATE_KEY),
  ].filter(Boolean);

  await Promise.all(actions);
});
