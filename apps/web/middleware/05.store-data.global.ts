import { EVENT_DATE_KEY } from "@overbookd/configuration";

export default defineNuxtRouteMiddleware(() => {
  const teamStore = useTeamStore();
  if (teamStore.teams.length === 0) teamStore.fetchTeams();

  if (teamStore.faReviewers.length === 0) teamStore.fetchFaReviewers();
  if (teamStore.ftReviewers.length === 0) teamStore.fetchFtReviewers();

  const configurationStore = useConfigurationStore();
  configurationStore.fetch(EVENT_DATE_KEY);
});
