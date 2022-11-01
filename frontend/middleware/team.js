export default async function (context) {
  if (context.store.$accessor.team.getAllTeams.length === 0) {
    await context.store.$accessor.team.setTeamsInStore();
  }
}
