export default defineNuxtRouteMiddleware(async () => {
  const teamStore = useTeamStore();
  if (teamStore.teams.length === 0) {
    await teamStore.fetchTeams();
  }
});
