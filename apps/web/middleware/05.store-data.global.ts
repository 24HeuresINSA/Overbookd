import { EVENT_DATE_KEY, ORGA_WEEK_DATE_KEY } from "@overbookd/configuration";

export default defineNuxtRouteMiddleware(async () => {
  const teamStore = useTeamStore();
  const configurationStore = useConfigurationStore();
  const userStore = useUserStore();

  const isLoggedIn = !!userStore.loggedUser;

  const shouldFetchTeams = teamStore.teams.length === 0;
  const shouldFetchEventDate = !configurationStore.get(EVENT_DATE_KEY);
  const shouldFetchOrgaWeekDate =
    !configurationStore.get(ORGA_WEEK_DATE_KEY) && isLoggedIn;

  const actions = [
    shouldFetchTeams ? teamStore.fetchTeams() : undefined,
    shouldFetchEventDate ? configurationStore.fetch(EVENT_DATE_KEY) : undefined,
    shouldFetchOrgaWeekDate
      ? configurationStore.fetch(ORGA_WEEK_DATE_KEY)
      : undefined,
  ].filter(Boolean);
  await Promise.all(actions);
});
