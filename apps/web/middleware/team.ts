export default async function (context: any) {
  if (context.store.$accessor.team.allTeams.length === 0) {
    await context.store.$accessor.team.setTeamsInStore();
  }
}
